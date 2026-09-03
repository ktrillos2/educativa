import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function approveStudent() {
  const email = 'student-03@gmail.com'
  console.log(`Buscando usuario con email: ${email}...`)

  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, name')
    .eq('email', email)

  if (userError || !users || users.length === 0) {
    console.error('Usuario no encontrado:', userError)
    process.exit(1)
  }

  const userId = users[0].id
  console.log(`Usuario encontrado: ${users[0].name} (ID: ${userId})`)

  // Buscar inscripciones
  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', userId)

  if (enrollError || !enrollments || enrollments.length === 0) {
    console.error('El usuario no tiene inscripciones activas.')
    process.exit(1)
  }

  console.log(`Se encontraron ${enrollments.length} inscripciones.`)

  for (const enrollment of enrollments) {
    const courseId = enrollment.course_id
    console.log(`Procesando curso: ${courseId}`)

    // Obtener información del curso
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('modules')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      console.error(`No se pudo obtener información del curso ${courseId}`)
      continue
    }

    const numModules = course.modules || 1
    console.log(`El curso tiene ${numModules} módulos. Aprobando todos...`)

    for (let i = 1; i <= numModules; i++) {
      const moduleId = `mod-${i}`
      
      const { error: upsertError } = await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          module_id: moduleId,
          score: 100, // 100% = 5.0
          completed: true,
          updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id, course_id, module_id'
        })

      if (upsertError) {
        // En caso de que no haya constraint único (user_id, course_id, module_id), 
        // fallback a borrar e insertar
        console.log(`Upsert falló para ${moduleId}, intentando delete/insert (Error: ${upsertError.message})`)
        
        await supabase
          .from('progress')
          .delete()
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .eq('module_id', moduleId)

        await supabase
          .from('progress')
          .insert({
            user_id: userId,
            course_id: courseId,
            module_id: moduleId,
            score: 100,
            completed: true
          })
      }
    }
    
    // Asegurarse de que el pago esté verificado
    console.log(`Verificando pago del curso...`)
    await supabase
      .from('enrollments')
      .update({ payment_verified: true })
      .eq('user_id', userId)
      .eq('course_id', courseId)
  }

  console.log('\n✅ ¡Listo! Todos los módulos y evaluaciones han sido aprobados para el estudiante.')
}

approveStudent()
