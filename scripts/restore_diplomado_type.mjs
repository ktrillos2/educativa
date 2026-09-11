import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log("🔍 Consultando todos los cursos en la base de datos...")
  const { data: courses, error } = await supabaseAdmin.from('courses').select('*')
  
  if (error) {
    console.error("Error al consultar cursos:", error)
    return
  }

  console.log("📌 Cursos existentes en DB:", courses)

  // Si existe el curso 9 o cualquier curso que debió ser diplomado, lo restauramos a type = 'diplomado'
  const { error: updateError } = await supabaseAdmin
    .from('courses')
    .update({ type: 'diplomado' })
    .eq('id', '9')

  if (updateError) {
    console.error("Error al restaurar curso 9:", updateError)
  } else {
    console.log("✅ Curso 9 restaurado correctamente a tipo 'diplomado'.")
  }
}

main().catch(console.error)
