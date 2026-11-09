/**
 * verify_clean_state.mjs — Verifica que la BD esté en ceros para producción
 */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const tables = [
  'users', 'enrollments', 'progress', 'orders',
  'course_groups', 'live_classes', 'class_attendance',
  'class_recordings', 'forum_topics', 'forum_replies', 'courses'
]

async function main() {
  console.log('\n📊 ESTADO ACTUAL DE LA BASE DE DATOS\n')

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log(`  ⚠️  ${table.padEnd(20)} — tabla no encontrada`)
    } else {
      const icon = count === 0 ? '✅' : (table === 'courses' || table === 'users') ? '📌' : '⚠️ '
      console.log(`  ${icon}  ${table.padEnd(20)} ${count} registros`)
    }
  }

  // Verificar auth.users
  const { data } = await supabase.auth.admin.listUsers()
  const authCount = data?.users?.length ?? 0
  console.log(`\n  📌  ${'auth.users'.padEnd(20)} ${authCount} cuenta(s) de acceso`)
  if (data?.users?.length) {
    for (const u of data.users) {
      console.log(`       → ${u.email}`)
    }
  }

  console.log('\n')
}

main().catch(console.error)

