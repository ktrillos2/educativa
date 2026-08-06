import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function makeAdmin() {
  const email = process.argv[2]
  
  if (!email) {
    console.error("Por favor, proporciona el correo electrónico del usuario. Ejemplo: npx tsx scripts/make-admin.ts correo@ejemplo.com")
    process.exit(1)
  }

  console.log(`Buscando usuario con email: ${email}...`)
  
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, name, role')
    .eq('email', email)
    .maybeSingle()
    
  if (!user) {
      console.log(`No se encontró ningún usuario con el correo: ${email}`)
      process.exit(1)
  }
  
  console.log(`Usuario encontrado: ${user.name} (Rol actual: ${user.role})`)

  // Actualizar rol a admin
  const { error } = await supabaseAdmin
    .from('users')
    .update({ role: 'admin' })
    .eq('id', user.id)

  if (error) {
    console.error("Error al actualizar el rol:", error.message)
    process.exit(1)
  }

  console.log(`\n¡Éxito! El usuario ${user.name} ahora es Administrador.`)
  process.exit(0)
}

makeAdmin()
