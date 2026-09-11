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
    id: 'diplomado-salud-ocupacional',
    title: 'Diplomado en Seguridad y Salud en el Trabajo',
    description: 'Capacítate en la prevención de riesgos laborales y normatividad vigente del SG-SST.',
    category: 'Salud',
    price: '$120.000 COP',
    duration: '120 horas',
    modules: 4,
    students: 'Autoestudio',
    image: '/images/workplace-safety-health-professional-training.jpg',
    type: 'diplomado',
    badge: 'Popular',
    min_students: 5
  },
  {
    id: 'diplomado-gestion-publica',
    title: 'Diplomado en Gestión Pública y Contratación Estatal',
    description: 'Aprende los principios fundamentales de la administración pública y los procesos contractuales del Estado.',
    category: 'Gestión',
    price: '$150.000 COP',
    duration: '140 horas',
    modules: 5,
    students: 'Autoestudio',
    image: '/images/government-contract-legal-documents.jpg',
    type: 'diplomado',
    badge: 'Certificado',
    min_students: 5
  },
  {
    id: 'diplomado-desarrollo-software',
    title: 'Diplomado en Desarrollo de Software y Frontend Web',
    description: 'Aprende a construir aplicaciones web modernas con React, Next.js y JavaScript avanzado.',
    category: 'Tecnología',
    price: '$180.000 COP',
    duration: '160 horas',
    modules: 6,
    students: 'Autoestudio',
    image: '/images/desarrollo-software.jpg',
    type: 'diplomado',
    badge: 'Nuevo',
    min_students: 5
  },
  {
    id: 'diplomado-derecho-laboral',
    title: 'Diplomado en Derecho Laboral y Talento Humano',
    description: 'Domina los aspectos legales, contratos y liquidaciones en la gestión del talento humano.',
    category: 'Legal',
    price: '$130.000 COP',
    duration: '120 horas',
    modules: 4,
    students: 'Autoestudio',
    image: '/images/labor-law-legal-documents-office.jpg',
    type: 'diplomado',
    badge: 'Popular',
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
