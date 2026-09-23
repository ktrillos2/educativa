import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateTitle() {
  const newTitle = 'PROGRAMA ACADÉMICO CONTROL INTERNO CON ENFOQUE EN LA GESTIÓN PÚBLICA Y EL CONTROL FISCAL'
  
  // 1. Update by ID
  const { data: byId, error: errById } = await supabase
    .from('courses')
    .update({ title: newTitle })
    .eq('id', 'programa-tecnico-sistemas')
    .select()

  console.log('Update by ID result:', byId, errById)

  // 2. Update any course with title matching "Sistemas"
  const { data: byTitle, error: errByTitle } = await supabase
    .from('courses')
    .update({ title: newTitle })
    .ilike('title', '%sistemas%')
    .select()

  console.log('Update by title match result:', byTitle, errByTitle)
}

updateTitle()
