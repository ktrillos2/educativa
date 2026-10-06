import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log("Corrigiendo la base de datos para el Diplomado en Presupuesto Público...")
  
  const { data, error } = await supabase
    .from("courses")
    .update({
      modules: 4,
      module_pdfs: {
        "mod-1": true,
        "mod-2": 1791303840466,
        "mod-3": true,
        "mod-4": true
      }
    })
    .ilike("title", "%presupuesto público%")
    .select()
  
  if (error) {
    console.error("Error al actualizar la base de datos:", error)
  } else {
    console.log("¡Base de datos actualizada con éxito!")
    console.log("Los 4 módulos ahora están enlazados a sus archivos correctos en Supabase.")
  }
}

run()
