import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sync() {
  console.log("Sincronizando usuarios registrados con las inscripciones...")
  
  const { data: users } = await supabaseAdmin.from('users').select('id').eq('role', 'user')
  const { data: courses } = await supabaseAdmin.from('courses').select('id')
  
  if (!users || users.length === 0) {
      return console.log("No hay usuarios para sincronizar.")
  }
  
  if (!courses || courses.length === 0) {
      return console.log("No hay cursos creados.")
  }

  // Tomamos el diplomado actual
  const courseId = courses[0].id
  
  let added = 0
  for (const user of users) {
      const { data: existing } = await supabaseAdmin
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle()
        
      if (!existing) {
          await supabaseAdmin.from('enrollments').insert({
              user_id: user.id,
              course_id: courseId,
              payment_verified: false
          })
          added++
      }
  }
  
  console.log(`\nSincronización completada.`)
  console.log(`Se inscribieron ${added} estudiantes faltantes.`)
  console.log(`Ahora la barra de progreso debería mostrar la cantidad real.`)
}

sync()
