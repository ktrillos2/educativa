/**
 * Script de migración única: lee todos los PDFs y JSONs de la carpeta local
 * "diplomados/" y los sube a Supabase Storage / columnas JSONB.
 *
 * Ejecutar: node scripts/migrate-diplomados-to-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join, extname, basename } from "path"
import { readdirSync, readFileSync, existsSync } from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, "../.env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/"/g, "")
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/"/g, "")

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Faltan variables de entorno.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const BUCKET = "course-modules"
const DIPLOMADOS_DIR = join(__dirname, "../diplomados")

async function main() {
  if (!existsSync(DIPLOMADOS_DIR)) {
    console.error(`❌ La carpeta "diplomados/" no existe en: ${DIPLOMADOS_DIR}`)
    process.exit(1)
  }

  const files = readdirSync(DIPLOMADOS_DIR)
  console.log(`\n📁 Archivos encontrados en diplomados/: ${files.length}`)
  files.forEach(f => console.log(`   - ${f}`))

  // Fetch all courses to know which IDs exist
  const { data: courses } = await supabase.from("courses").select("id, module_pdfs, exam_pdfs, exams_data")
  const courseMap = new Map(courses?.map(c => [c.id, c]) || [])

  // Tracking changes per course
  const modulePdfsMap = {}   // courseId -> { "mod-1": true, ... }
  const examPdfsMap = {}     // courseId -> { "mod-1": true, ... }
  const examsDataMap = {}    // courseId -> parsed JSON

  let uploadedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const file of files) {
    const filePath = join(DIPLOMADOS_DIR, file)
    const ext = extname(file).toLowerCase()

    // ─── Handle JSON exam files: exams_{courseId}.json ───────────────────────
    if (ext === ".json") {
      const match = file.match(/^exams_(.+)\.json$/)
      if (!match) { console.log(`⏭  Ignorando JSON no reconocido: ${file}`); continue }
      
      const courseId = match[1]
      try {
        const content = JSON.parse(readFileSync(filePath, "utf-8"))
        examsDataMap[courseId] = content
        console.log(`\n📋 JSON encontrado para curso "${courseId}": ${Object.keys(content).length} módulos con preguntas`)
      } catch (e) {
        console.error(`❌ Error leyendo ${file}:`, e.message)
        errorCount++
      }
      continue
    }

    // ─── Handle PDF files ─────────────────────────────────────────────────────
    if (ext !== ".pdf") { console.log(`⏭  Ignorando archivo no PDF: ${file}`); continue }

    // Pattern 1: "Modulo {N} - {courseId}.pdf"
    const moduleMatch = file.match(/^Modulo (\d+) - (.+)\.pdf$/i)
    // Pattern 2: "Cuestionario Modulo {N} - {courseId}.pdf"  
    const examMatch = file.match(/^Cuestionario Modulo (\d+) - (.+)\.pdf$/i)

    if (!moduleMatch && !examMatch) {
      console.log(`⏭  PDF con nombre no reconocido, ignorando: ${file}`)
      skippedCount++
      continue
    }

    const isExam = !!examMatch
    const moduleIndex = isExam ? examMatch[1] : moduleMatch[1]
    const courseId = isExam ? examMatch[2] : moduleMatch[2]
    const modKey = `mod-${moduleIndex}`
    const storagePath = isExam
      ? `${courseId}/cuestionario-modulo-${moduleIndex}.pdf`
      : `${courseId}/modulo-${moduleIndex}.pdf`

    console.log(`\n📤 Subiendo: ${file}`)
    console.log(`   → Bucket path: ${storagePath}`)

    try {
      const fileBuffer = readFileSync(filePath)

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileBuffer, {
          contentType: "application/pdf",
          upsert: true,
        })

      if (uploadError) {
        console.error(`   ❌ Error de Storage: ${uploadError.message}`)
        errorCount++
        continue
      }

      console.log(`   ✅ Subido correctamente`)

      // Track for DB update
      if (isExam) {
        if (!examPdfsMap[courseId]) examPdfsMap[courseId] = {}
        examPdfsMap[courseId][modKey] = true
      } else {
        if (!modulePdfsMap[courseId]) modulePdfsMap[courseId] = {}
        modulePdfsMap[courseId][modKey] = true
      }

      uploadedCount++
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`)
      errorCount++
    }
  }

  // ─── Update DB for all affected courses ───────────────────────────────────
  console.log("\n💾 Actualizando base de datos...")

  const allCourseIds = new Set([
    ...Object.keys(modulePdfsMap),
    ...Object.keys(examPdfsMap),
    ...Object.keys(examsDataMap),
  ])

  for (const courseId of allCourseIds) {
    const existing = courseMap.get(courseId)
    const updatePayload = {}

    if (modulePdfsMap[courseId]) {
      updatePayload.module_pdfs = {
        ...(existing?.module_pdfs || {}),
        ...modulePdfsMap[courseId],
      }
    }

    if (examPdfsMap[courseId]) {
      updatePayload.exam_pdfs = {
        ...(existing?.exam_pdfs || {}),
        ...examPdfsMap[courseId],
      }
    }

    if (examsDataMap[courseId]) {
      updatePayload.exams_data = examsDataMap[courseId]
    }

    if (Object.keys(updatePayload).length === 0) continue

    const { error: dbError } = await supabase
      .from("courses")
      .update(updatePayload)
      .eq("id", courseId)

    if (dbError) {
      console.error(`   ❌ Error actualizando curso "${courseId}": ${dbError.message}`)
      errorCount++
    } else {
      console.log(`   ✅ Curso "${courseId}" actualizado en la base de datos`)
    }
  }

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log("\n" + "=".repeat(50))
  console.log("📊 RESUMEN DE MIGRACIÓN")
  console.log("=".repeat(50))
  console.log(`✅ PDFs subidos exitosamente : ${uploadedCount}`)
  console.log(`⏭  Archivos ignorados         : ${skippedCount}`)
  console.log(`❌ Errores                    : ${errorCount}`)
  console.log(`📋 JSONs de exámenes migrados : ${Object.keys(examsDataMap).length}`)
  console.log("=".repeat(50))

  if (errorCount > 0) {
    console.log("\n⚠️  Algunos archivos tuvieron errores. Revisa los mensajes arriba.")
  } else {
    console.log("\n🎉 Migración completada sin errores.")
  }
}

main().catch(console.error)
