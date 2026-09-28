/**
 * Script de verificación: confirma que los datos migraron correctamente a Supabase.
 * Ejecutar: node scripts/verify-migration.mjs
 */
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, "../.env.local") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/"/g, ""),
  process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/"/g, ""),
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  console.log("\n🔍 VERIFICANDO MIGRACIÓN...\n")

  // 1. Verificar columnas en la tabla courses
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, modules, module_pdfs, exam_pdfs, exams_data")

  if (error) {
    console.error("❌ Error al leer la tabla courses:", error.message)
    return
  }

  console.log("═".repeat(60))
  console.log("📋 ESTADO DE CURSOS EN BASE DE DATOS")
  console.log("═".repeat(60))

  for (const course of courses) {
    const modulePdfs = course.module_pdfs || {}
    const examPdfs = course.exam_pdfs || {}
    const examsData = course.exams_data || {}

    const pdfCount = Object.values(modulePdfs).filter(Boolean).length
    const examPdfCount = Object.values(examPdfs).filter(Boolean).length
    const examQuestionsCount = Object.keys(examsData).length

    const hasSomething = pdfCount > 0 || examPdfCount > 0 || examQuestionsCount > 0
    if (!hasSomething) continue

    console.log(`\n📚 Curso: ${course.id}`)
    console.log(`   Módulos configurados : ${course.modules || 0}`)
    console.log(`   PDFs de módulos      : ${pdfCount > 0 ? `✅ ${pdfCount} módulo(s) con PDF` : "❌ Ninguno"}`)
    console.log(`   PDFs de exámenes     : ${examPdfCount > 0 ? `✅ ${examPdfCount} módulo(s) con PDF` : "— Ninguno"}`)
    console.log(`   Preguntas de examen  : ${examQuestionsCount > 0 ? `✅ ${examQuestionsCount} módulo(s) con preguntas` : "❌ Ninguno"}`)

    if (examQuestionsCount > 0) {
      for (const [modKey, questions] of Object.entries(examsData)) {
        if (Array.isArray(questions)) {
          console.log(`      ${modKey}: ${questions.length} preguntas`)
        }
      }
    }
  }

  // 2. Verificar archivos en Storage
  console.log("\n" + "═".repeat(60))
  console.log("📦 ARCHIVOS EN SUPABASE STORAGE (course-modules)")
  console.log("═".repeat(60))

  const { data: storageFiles, error: storageError } = await supabase.storage
    .from("course-modules")
    .list("", { limit: 100 })

  if (storageError) {
    console.error("❌ Error al listar Storage:", storageError.message)
  } else {
    for (const folder of storageFiles) {
      const { data: folderFiles } = await supabase.storage
        .from("course-modules")
        .list(folder.name, { limit: 100 })

      console.log(`\n  📁 ${folder.name}/`)
      for (const file of folderFiles || []) {
        const sizeKB = file.metadata?.size ? `(${Math.round(file.metadata.size / 1024)} KB)` : ""
        console.log(`     ✅ ${file.name} ${sizeKB}`)
      }
    }
  }

  console.log("\n" + "═".repeat(60))
  console.log("✅ Verificación completada.")
  console.log("═".repeat(60) + "\n")
}

main().catch(console.error)
