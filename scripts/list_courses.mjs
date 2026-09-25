import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function main() {
  console.log("🔍 Buscando todos los cursos en la base de datos...")
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title')

  if (error) {
    console.error("❌ Error leyendo cursos:", error)
    process.exit(1)
  }

  console.log("\n📋 Cursos actuales en la base de datos:")
  console.table(courses)
  process.exit(0)
}

main().catch(console.error)
