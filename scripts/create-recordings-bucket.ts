import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import { resolve } from "path"

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Faltan credenciales de Supabase en el archivo .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createBucket() {
  console.log("⏳ Creando bucket 'recordings' en Supabase...")
  
  // Create bucket
  const { data, error } = await supabase.storage.createBucket('recordings', {
    public: true, // Make it public so students can watch the videos
    allowedMimeTypes: ['video/mp4', 'video/webm']
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log("✅ El bucket 'recordings' ya existe.")
    } else {
      console.error("❌ Error creando el bucket:", error.message)
      return
    }
  } else {
    console.log("✅ Bucket 'recordings' creado exitosamente.")
  }

  // Allow public read access via policies (Storage policies are a bit complex via API, 
  // but if the bucket is public, Supabase auto-generates some read policies for public buckets)
  console.log("🎉 Todo listo. Ya puedes grabar la clase.")
}

createBucket()
