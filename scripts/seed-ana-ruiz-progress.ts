/**
 * Script de semilla para simular que Ana Ruiz completó el 80% del diplomado.
 * Ejecutar con: npx tsx scripts/seed-ana-ruiz-progress.ts
 *
 * Este script:
 * 1. Busca a Ana Ruiz en la tabla auth.users de Supabase
 * 2. Busca el curso en la tabla courses
 * 3. Se asegura de que tenga enrollment activo y verificado
 * 4. Inserta registros de progreso para el 80% de los módulos (marcados como completados)
 */

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Faltan variables de entorno. Asegúrate de tener .env.local configurado.")
  process.exit(1)
}

// Admin client con service_role (acceso total, sin RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  console.log("🔍 Buscando usuario Ana Ruiz en Supabase Auth...")

  // 1. Buscar a Ana Ruiz en auth.users
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()
  if (usersError) {
    console.error("❌ Error listando usuarios:", usersError.message)
    process.exit(1)
  }

  const anaRuiz = usersData.users.find((u) =>
    u.user_metadata?.name?.toLowerCase().includes("ana ruiz") ||
    u.email?.toLowerCase().includes("ana") ||
    u.user_metadata?.full_name?.toLowerCase().includes("ana ruiz")
  )

  if (!anaRuiz) {
    console.error("❌ No se encontró el usuario Ana Ruiz. Usuarios disponibles:")
    usersData.users.forEach((u) =>
      console.log(`  - ${u.email} | ${u.user_metadata?.name ?? "sin nombre"} | id: ${u.id}`)
    )
    process.exit(1)
  }

  console.log(`✅ Ana Ruiz encontrada: id=${anaRuiz.id}, email=${anaRuiz.email}`)

  // 2. Buscar el curso (Diplomado en Presupuesto Público)
  console.log("\n🔍 Buscando el diplomado en la tabla courses...")
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id, title, modules")

  if (coursesError) {
    console.error("❌ Error buscando cursos:", coursesError.message)
    process.exit(1)
  }

  console.log("📚 Cursos disponibles:")
  courses?.forEach((c) => console.log(`  - [${c.id}] ${c.title} (${c.modules} módulos)`))

  // Tomar el primero (o el único diplomado)
  const course = courses?.[0]
  if (!course) {
    console.error("❌ No se encontró ningún curso en la base de datos.")
    process.exit(1)
  }

  const totalModules: number = course.modules ?? 5
  const modulesToComplete = Math.ceil(totalModules * 0.8) // 80% redondeado hacia arriba
  console.log(`\n📊 Curso: "${course.title}" (id: ${course.id})`)
  console.log(`   Total módulos: ${totalModules} | Módulos a completar (80%): ${modulesToComplete}`)

  // 3. Verificar / crear enrollment
  console.log("\n🔍 Verificando inscripción de Ana Ruiz en el curso...")
  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("id, payment_verified")
    .eq("user_id", anaRuiz.id)
    .eq("course_id", course.id)
    .maybeSingle()

  if (existingEnrollment) {
    console.log(`   ✅ Ya inscrita (enrollment id: ${existingEnrollment.id})`)
    if (!existingEnrollment.payment_verified) {
      await supabase
        .from("enrollments")
        .update({ payment_verified: true })
        .eq("id", existingEnrollment.id)
      console.log("   ✅ Pago marcado como verificado")
    }
  } else {
    const { error: enrollError } = await supabase.from("enrollments").insert({
      user_id: anaRuiz.id,
      course_id: course.id,
      payment_verified: true,
    })
    if (enrollError) {
      console.error("❌ Error creando enrollment:", enrollError.message)
      process.exit(1)
    }
    console.log("   ✅ Enrollment creado con pago verificado")
  }

  // 4. Insertar/actualizar registros de progreso
  console.log(`\n📝 Insertando progreso para ${modulesToComplete} de ${totalModules} módulos...`)

  for (let i = 1; i <= totalModules; i++) {
    const moduleId = `mod-${i}`
    const isCompleted = i <= modulesToComplete
    const score = isCompleted ? 85 : 0 // 85/100 en los módulos completados

    // Verificar si ya existe
    const { data: existingProgress } = await supabase
      .from("progress")
      .select("id")
      .eq("user_id", anaRuiz.id)
      .eq("course_id", course.id)
      .eq("module_id", moduleId)
      .maybeSingle()

    if (existingProgress) {
      const { error } = await supabase
        .from("progress")
        .update({
          score,
          completed: isCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingProgress.id)

      if (error) {
        console.error(`   ❌ Error actualizando ${moduleId}:`, error.message)
      } else {
        console.log(`   ${isCompleted ? "✅" : "⏳"} ${moduleId}: ${isCompleted ? `score=${score}, completed` : "pendiente"} (actualizado)`)
      }
    } else {
      const { error } = await supabase.from("progress").insert({
        user_id: anaRuiz.id,
        course_id: course.id,
        module_id: moduleId,
        score,
        completed: isCompleted,
      })

      if (error) {
        console.error(`   ❌ Error insertando ${moduleId}:`, error.message)
      } else {
        console.log(`   ${isCompleted ? "✅" : "⏳"} ${moduleId}: ${isCompleted ? `score=${score}, completed` : "pendiente"} (insertado)`)
      }
    }
  }

  console.log("\n🎉 ¡Listo! Ana Ruiz tiene el 80% del diplomado completado.")
  console.log("   Puedes verificarlo iniciando sesión con su cuenta en la plataforma.")
}

main().catch((e) => {
  console.error("❌ Error inesperado:", e)
  process.exit(1)
})
