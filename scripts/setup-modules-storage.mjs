/**
 * Script de configuración única: crea el bucket "course-modules" en Supabase Storage.
 * También agrega las columnas exams_data y module_pdfs a la tabla courses si no existen.
 *
 * Ejecutar UNA SOLA VEZ: node scripts/setup-modules-storage.mjs
 */
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, "../.env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/"/g, "")
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/"/g, "")

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  // 1. Create bucket course-modules (private, uses signed URLs)
  const BUCKET = "course-modules"
  console.log(`\n🔧 Creando bucket "${BUCKET}"...`)

  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some((b) => b.name === BUCKET)

  if (bucketExists) {
    console.log(`✅ El bucket "${BUCKET}" ya existe.`)
  } else {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: false, // Private — access via signed URLs
      fileSizeLimit: 52428800, // 50 MB
      allowedMimeTypes: ["application/pdf"],
    })
    if (error) {
      console.error(`❌ Error al crear bucket: ${error.message}`)
      process.exit(1)
    }
    console.log(`✅ Bucket "${BUCKET}" creado como privado (acceso por signed URLs).`)
  }

  // 2. Add exams_data JSONB column to courses table
  console.log("\n🔧 Agregando columna exams_data a la tabla courses...")
  const { error: examColError } = await supabase.rpc("exec_sql", {
    sql: `ALTER TABLE courses ADD COLUMN IF NOT EXISTS exams_data JSONB DEFAULT '{}'::jsonb;`,
  })
  if (examColError) {
    // exec_sql RPC might not exist — provide manual SQL
    console.warn("⚠️  No se pudo agregar la columna automáticamente. Ejecuta este SQL manualmente en Supabase:")
    console.warn(`   ALTER TABLE courses ADD COLUMN IF NOT EXISTS exams_data JSONB DEFAULT '{}'::jsonb;`)
    console.warn(`   ALTER TABLE courses ADD COLUMN IF NOT EXISTS module_pdfs JSONB DEFAULT '{}'::jsonb;`)
  } else {
    console.log("✅ Columna exams_data agregada (o ya existía).")

    const { error: pdfColError } = await supabase.rpc("exec_sql", {
      sql: `ALTER TABLE courses ADD COLUMN IF NOT EXISTS module_pdfs JSONB DEFAULT '{}'::jsonb;`,
    })
    if (!pdfColError) {
      console.log("✅ Columna module_pdfs agregada (o ya existía).")
    }
  }

  console.log("\n📋 INSTRUCCIONES MANUALES (si el SQL automático falló):")
  console.log("   Ve a Supabase → SQL Editor y ejecuta:")
  console.log("   ALTER TABLE courses ADD COLUMN IF NOT EXISTS exams_data JSONB DEFAULT '{}'::jsonb;")
  console.log("   ALTER TABLE courses ADD COLUMN IF NOT EXISTS module_pdfs JSONB DEFAULT '{}'::jsonb;")
  console.log("\n✅ Setup completado.")
}

main().catch(console.error)
