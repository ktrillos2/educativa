import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function approveJuanDiaz() {
  // 1. Buscar el usuario Juan Díaz
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, name, email')
    .ilike('name', '%juan%d%az%')

  if (userError) {
    console.error('Error buscando usuario:', userError)
    return
  }

  if (!users || users.length === 0) {
    console.log('❌ No se encontró el usuario Juan Díaz')
    return
  }

  console.log('Usuarios encontrados:')
  users.forEach(u => console.log(`  - id: ${u.id}, nombre: ${u.name}, email: ${u.email}`))

  // Si hay más de uno, actualiza todos los que coincidan
  for (const user of users) {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', user.id)

    const { data: orders } = await supabase
      .from('orders')
      .select('course_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const courseIdToApprove = enrollments?.[0]?.course_id || orders?.[0]?.course_id

    if (!courseIdToApprove) {
      console.log(`⚠️  ${user.name} no tiene inscripciones ni órdenes registradas.`)
      continue
    }

    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseIdToApprove)
      .maybeSingle()

    let upsertError = null
    if (existing) {
      const { error } = await supabase
        .from('enrollments')
        .update({ payment_verified: true })
        .eq('id', existing.id)
      upsertError = error
    } else {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseIdToApprove,
          payment_verified: true
        })
      upsertError = error
    }

    if (upsertError) {
      console.error(`Error aprobando pago para ${user.name}:`, upsertError)
    } else {
      console.log(`✅ Inscripción aprobada con éxito para ${user.name} (Curso ID: ${courseIdToApprove})`)
    }
  }
}

approveJuanDiaz()
