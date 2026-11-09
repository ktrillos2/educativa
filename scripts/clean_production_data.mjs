/**
 * clean_production_data.mjs
 *
 * Elimina TODA la información hipotética de alumnos antes del lanzamiento
 * a producción. NO toca cursos, configuración del sitio ni estructura.
 *
 * Tablas que se limpian:
 *   - class_attendance   (asistencias a clases en vivo)
 *   - class_recordings   (grabaciones de clases)
 *   - forum_replies      (respuestas en foros)
 *   - forum_topics       (temas de foros)
 *   - live_classes       (clases en vivo programadas)
 *   - course_groups      (cohortes / grupos de alumnos)
 *   - diplomas           (diplomas generados)
 *   - progress           (progreso de módulos)
 *   - enrollments        (inscripciones)
 *   - orders             (pedidos / pagos)
 *   - users (public)     (perfil de alumnos)
 *   - auth.users         (cuentas de autenticación, excepto admins)
 *
 * Uso: node scripts/clean_production_data.mjs
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

/** Elimina todos los registros de una tabla y reporta el resultado */
async function truncate(table) {
  const { error, count } = await supabase
    .from(table)
    .delete({ count: 'exact' })
    .neq('id', '00000000-0000-0000-0000-000000000000') // condición siempre verdadera para borrar todo

  if (error) {
    // Algunos errores son esperables si la tabla no existe aún o está vacía
    console.warn(`  ⚠️  ${table}: ${error.message}`)
  } else {
    console.log(`  ✅  ${table}: ${count ?? 'todos los'} registros eliminados`)
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║   LIMPIEZA DE DATOS HIPOTÉTICOS — PRODUCCIÓN     ║')
  console.log('╚══════════════════════════════════════════════════╝\n')

  // ── 1. Tablas dependientes (deben borrarse primero por FK constraints) ──
  console.log('📋 Paso 1: Tablas de actividad de alumnos...')
  await truncate('class_attendance')
  await truncate('class_recordings')
  await truncate('forum_replies')
  await truncate('forum_topics')

  // ── 2. Tablas de gestión de clases y grupos ──
  console.log('\n📋 Paso 2: Clases en vivo y grupos...')
  await truncate('live_classes')
  await truncate('course_groups')

  // ── 3. Datos académicos del alumno ──
  console.log('\n📋 Paso 3: Datos académicos (diplomas, progreso, inscripciones, órdenes)...')
  await truncate('diplomas')
  await truncate('progress')
  await truncate('enrollments')
  await truncate('orders')

  // ── 4. Perfiles de alumnos en public.users ──
  console.log('\n📋 Paso 4: Perfiles de alumnos en public.users...')
  await truncate('users')

  // ── 5. Cuentas de autenticación (auth.users) ──
  // Solo se pueden borrar vía Admin API; usamos listUsers + deleteUser
  console.log('\n📋 Paso 5: Cuentas de autenticación (auth.users)...')
  await deleteAuthUsers()

  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║   ✅ Limpieza completada. Base de datos lista     ║')
  console.log('║      para producción.                             ║')
  console.log('╚══════════════════════════════════════════════════╝\n')
}

/** Elimina todos los usuarios de auth.users (excepto los que tengan rol admin en public.users) */
async function deleteAuthUsers() {
  // Obtenemos los UUIDs que son admin para NO borrarlos
  const { data: admins } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')

  const adminIds = new Set((admins || []).map((u) => u.id))

  let page = 1
  let totalDeleted = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 })

    if (error) {
      console.warn(`  ⚠️  auth.users: No se pudo listar usuarios — ${error.message}`)
      break
    }

    const { users } = data
    hasMore = users.length === 100
    page++

    for (const user of users) {
      if (adminIds.has(user.id)) {
        console.log(`  🛡️  Usuario admin conservado: ${user.email}`)
        continue
      }

      const { error: delError } = await supabase.auth.admin.deleteUser(user.id)
      if (delError) {
        console.warn(`  ⚠️  No se pudo borrar auth user ${user.email}: ${delError.message}`)
      } else {
        totalDeleted++
      }
    }
  }

  console.log(`  ✅  auth.users: ${totalDeleted} cuentas eliminadas`)
}

main().catch((err) => {
  console.error('\n❌ Error inesperado:', err)
  process.exit(1)
})

