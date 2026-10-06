import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const folderPath = "gestion-presupuesto-publico"
  console.log(`Buscando archivos en la carpeta: ${folderPath}...`)
  
  const { data, error } = await supabase.storage
    .from("course-modules")
    .list(folderPath, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })
  
  if (error) {
    console.error("Error buscando en Supabase Storage:", error)
  } else {
    console.log("Archivos encontrados en Supabase Storage:")
    console.log(JSON.stringify(data, null, 2))
  }
}

run()
