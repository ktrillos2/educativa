/**
 * Script de configuración única: crea el bucket "course-covers"
 * en Supabase Storage con acceso público.
 *
 * Ejecutar UNA SOLA VEZ: node scripts/create-storage-bucket.mjs
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

const BUCKET_NAME = "course-covers"

async function main() {
  console.log(`🔧 Creando bucket "${BUCKET_NAME}" en Supabase Storage...`)

  // Check if bucket already exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    console.error("❌ Error al listar buckets:", listError.message)
    process.exit(1)
  }

  const exists = buckets?.some((b) => b.name === BUCKET_NAME)
  if (exists) {
    console.log(`✅ El bucket "${BUCKET_NAME}" ya existe. No se requiere ninguna acción.`)
    process.exit(0)
  }

  const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true,           // URLs públicas sin autenticación
    fileSizeLimit: 5242880, // 5 MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  })

  if (error) {
    console.error("❌ Error al crear el bucket:", error.message)
    process.exit(1)
  }

  console.log(`✅ Bucket "${BUCKET_NAME}" creado exitosamente con acceso público.`)
  console.log("   Las imágenes se servirán desde:")
  console.log(`   ${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/<filename>`)
}

main()
