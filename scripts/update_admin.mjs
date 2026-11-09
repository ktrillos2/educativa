/**
 * update_admin.mjs
 *
 * Actualiza los datos del administrador:
 *  - Nombre: Auden Viloria
 *  - Email:  academicaadmin.edu@gmail.com
 *  - Limpia documento de identidad ficticio
 *
 * Uso: node scripts/update_admin.mjs
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
  console.error('❌ Faltan variables de entorno.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const OLD_EMAIL = 'admin@prueba.com'
const NEW_EMAIL = 'academicaadmin.edu@gmail.com'
const NEW_NAME  = 'Auden Viloria'

async function main() {
  console.log('\n🔧 Actualizando datos del administrador...\n')

  // 1. Buscar el usuario en auth por email actual
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers()
  if (listErr) { console.error('❌ No se pudo listar usuarios:', listErr.message); process.exit(1) }

  const authUser = list.users.find(u => u.email === OLD_EMAIL || u.email === NEW_EMAIL)
  if (!authUser) {
    console.error(`❌ No se encontró ningún usuario con email "${OLD_EMAIL}" ni "${NEW_EMAIL}".`)
    process.exit(1)
  }

  console.log(`🔎 Usuario encontrado: ${authUser.email} (ID: ${authUser.id})`)

  // 2. Actualizar email en auth.users (solo si aún tiene el email viejo)
  if (authUser.email === OLD_EMAIL) {
    const { error: authUpdateErr } = await supabase.auth.admin.updateUserById(authUser.id, {
      email: NEW_EMAIL,
      email_confirm: true,
    })
    if (authUpdateErr) {
      console.error('❌ Error actualizando email en auth:', authUpdateErr.message)
      process.exit(1)
    }
    console.log(`✅ Email actualizado en auth.users → ${NEW_EMAIL}`)
  } else {
    console.log(`ℹ️  Email ya está correcto en auth: ${authUser.email}`)
  }

  // 3. Actualizar perfil en public.users
  const { error: profileErr } = await supabase
    .from('users')
    .update({
      name:     NEW_NAME,
      email:    NEW_EMAIL,
      document: 'ADMIN',  // campo requerido por BD — sin CC real
      phone:    null,
      address:  null,
      role:     'admin',
    })
    .eq('id', authUser.id)

  if (profileErr) {
    console.error('❌ Error actualizando public.users:', profileErr.message)
    process.exit(1)
  }

  console.log(`✅ Perfil actualizado en public.users`)

  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║   ✅ Administrador actualizado correctamente      ║')
  console.log('║                                                  ║')
  console.log(`║   Nombre: ${NEW_NAME.padEnd(38)} ║`)
  console.log(`║   Email:  ${NEW_EMAIL.padEnd(38)} ║`)
  console.log('╚══════════════════════════════════════════════════╝\n')
}

main().catch(err => {
  console.error('❌ Error inesperado:', err)
  process.exit(1)
})
