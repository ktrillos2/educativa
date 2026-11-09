/**
 * create_admin.mjs
 *
 * Crea (o restaura) la cuenta de administrador en Supabase Auth
 * y en la tabla public.users con role = 'admin'.
 *
 * Uso: node scripts/create_admin.mjs
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
  console.error('❌ Faltan variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Datos del administrador ───────────────────────────────────────────────────
const ADMIN_EMAIL    = 'admin@prueba.com'
const ADMIN_PASSWORD = 'AdbFFG456*'
const ADMIN_NAME     = 'Administrador'
const ADMIN_DOCUMENT = '000000000'
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔧 Creando cuenta de administrador...\n')

  // 1. Crear usuario en auth.users
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,   // confirmar email automáticamente
  })

  if (authError) {
    // Si ya existe, intentamos obtener su UUID
    if (authError.message?.includes('already') || authError.message?.includes('exists')) {
      console.log('ℹ️  El usuario ya existe en auth. Buscando su UUID...')
      const { data: list } = await supabase.auth.admin.listUsers()
      const existing = list?.users?.find(u => u.email === ADMIN_EMAIL)
      if (!existing) {
        console.error('❌ No se pudo encontrar el usuario existente.')
        process.exit(1)
      }
      await upsertPublicUser(existing.id)
      return
    }
    console.error('❌ Error creando auth user:', authError.message)
    process.exit(1)
  }

  const userId = authData.user.id
  console.log(`✅ Usuario creado en auth.users con ID: ${userId}`)

  await upsertPublicUser(userId)
}

async function upsertPublicUser(userId) {
  // 2. Crear o actualizar el perfil en public.users con role = 'admin'
  const { error: profileError } = await supabase
    .from('users')
    .upsert(
      {
        id:       userId,
        name:     ADMIN_NAME,
        document: ADMIN_DOCUMENT,
        email:    ADMIN_EMAIL,
        role:     'admin',
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    console.error('❌ Error creando perfil en public.users:', profileError.message)
    process.exit(1)
  }

  console.log('✅ Perfil de admin creado en public.users con role = "admin"')
  console.log('\n╔══════════════════════════════════════════╗')
  console.log('║   ✅ Admin listo para iniciar sesión      ║')
  console.log('║                                          ║')
  console.log(`║   Email:    ${ADMIN_EMAIL.padEnd(28)} ║`)
  console.log(`║   Password: ${ADMIN_PASSWORD.padEnd(28)} ║`)
  console.log('╚══════════════════════════════════════════╝\n')
}

main().catch(err => {
  console.error('❌ Error inesperado:', err)
  process.exit(1)
})

