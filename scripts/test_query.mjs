import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  const res1 = await supabase.from("users").select("*").not("role", "in", '("admin","ADMIN")')
  console.log("res1 error:", res1.error)
  console.log("res1 data count:", res1.data?.length)
  console.log("res1 data:", res1.data)
}
test()

