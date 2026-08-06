import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedProgress() {
  console.log("Buscando a la estudiante Ana Ruiz...")
  
  // Buscar a Ana Ruiz
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, name')
    .ilike('name', '%Ana Ruiz%')
    .maybeSingle()
    
  if (!user) {
      return console.log("No se encontró ninguna estudiante con el nombre Ana Ruiz.")
  }
  
  console.log(`Encontrada: ${user.name} (ID: ${user.id})`)

  // Tomamos el diplomado actual y su cantidad de módulos
  const { data: courses } = await supabaseAdmin.from('courses').select('id, modules').limit(1)
  
  if (!courses || courses.length === 0) {
      return console.log("No hay cursos creados.")
  }

  const courseId = courses[0].id
  const totalModules = courses[0].modules || 5

  console.log("Verificando inscripción...")
  // Asegurar que está inscrita (sin modificar estado de pago)
  const { data: enrollment } = await supabaseAdmin
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle()

  if (!enrollment) {
      await supabaseAdmin
        .from('enrollments')
        .insert({
            user_id: user.id,
            course_id: courseId,
            payment_verified: false
        })
  }

  // Calcular exactamente el 100%
  const targetModules = totalModules
  console.log(`Generando progreso (${targetModules} módulos completados de ${totalModules} para alcanzar el 100%)...`)
  
  // Limpiar progresos anteriores para evitar que tenga menos
  await supabaseAdmin
      .from('progress')
      .delete()
      .eq('user_id', user.id)
      .eq('course_id', courseId)

  // Módulos a completar (mod-1 a mod-N)
  for (let i = 1; i <= targetModules; i++) {
      await supabaseAdmin
          .from('progress')
          .insert({
              user_id: user.id,
              course_id: courseId,
              module_id: `mod-${i}`,
              score: 100,
              completed: true
          })
  }

  console.log(`\n¡Listo! Ana Ruiz ahora tiene exactamente el 100% completado (${targetModules}/${totalModules} módulos) con calificación de 100.`)
  process.exit(0)
}

seedProgress()
