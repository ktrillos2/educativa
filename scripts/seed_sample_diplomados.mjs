import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const sampleDiplomados = [
  {
    id: '9',
    title: 'Diplomado en Gestión del Presupuesto Público',
    description: 'Capacitación integral sobre la planeación, programación y ejecución del presupuesto en el sector público.',
    category: 'Gestión',
    price: '$1.150.000 COP',
    duration: '80 horas',
    modules: 4,
    students: 'Autoestudio',
    image: '/finance-budget-accounting-professional-calculator.jpg',
    type: 'diplomado',
    badge: 'Certificado',
    min_students: 5
  }
]

async function seed() {
  console.log('⏳ Verificando y poblando diplomados en la base de datos...')
  
  for (const course of sampleDiplomados) {
    const { error } = await supabase
      .from('courses')
      .upsert(course, { onConflict: 'id' })
      
    if (error) {
      console.error(`❌ Error al insertar ${course.id}:`, error)
    } else {
      console.log(`✅ Diplomado ${course.title} insertado/actualizado correctamente.`)
    }
  }
}

seed().catch(console.error)
