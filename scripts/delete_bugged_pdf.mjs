import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Cargar variables de entorno locales
dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log("Iniciando eliminación forzada de PDFs antiguos de Diplomados...")

  // Borrar cualquier clave que contenga 'diplomado' en la base de datos
  const { error: dbError } = await supabase
    .from("platform_settings")
    .delete()
    .ilike("key", "%diplomado%")
  
  if (dbError) {
    console.error("❌ Error al limpiar la base de datos:", dbError)
  } else {
    console.log("✅ Referencias antiguas de la base de datos eliminadas con éxito.")
  }

  // Eliminar archivos físicos en storage
  try {
    for (const folder of ["info", "info-pdfs"]) {
      const { data: files } = await supabase.storage.from("educativa-assets").list(folder)
      if (files && files.length > 0) {
        const filesToRemove = files
          .filter(f => f.name.includes("diplomado"))
          .map(f => `${folder}/${f.name}`)

        if (filesToRemove.length > 0) {
          console.log(`Borrando ${filesToRemove.length} archivos de /${folder}...`)
          await supabase.storage.from("educativa-assets").remove(filesToRemove)
        }
      }
    }
    console.log("✅ Archivos físicos antiguos eliminados de Storage.")
  } catch (e) {
    console.warn("⚠️ No se pudieron limpiar algunos archivos físicos:", e)
  }

  console.log("¡Proceso completado! Ya puedes subir el nuevo PDF desde el Admin.")
}

main()
