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

async function seed() {
  const { data, error } = await supabase.from('courses').insert({
    id: 'programa-tecnico-sistemas',
    title: 'Técnico en Sistemas y Computación (ETDH)',
    description: 'Programa técnico laboral por competencias en sistemas y mantenimiento de equipos de cómputo.',
    category: 'Tecnología',
    price: '$200.000 COP / Semestre',
    duration: '3 Semestres',
    modules: 4,
    students: '15 cupos',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
    type: 'etdh'
  })

  if (error) {
    console.error('Error inserting course:', error)
  } else {
    console.log('Successfully inserted ETDH course!')
  }
}

seed()
