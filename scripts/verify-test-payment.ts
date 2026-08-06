import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyPayment() {
  console.log("Buscando a la estudiante Ana Ruiz para simular el pago...")
  
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

  // Actualizar todas sus inscripciones a payment_verified = true
  const { error } = await supabaseAdmin
    .from('enrollments')
    .update({ payment_verified: true })
    .eq('user_id', user.id)

  if (error) {
    console.error("Error al actualizar la inscripción:", error)
    return
  }

  // Marcar cualquier orden pendiente como pagada (opcional)
  await supabaseAdmin
    .from('orders')
    .update({ status: 'PAID' })
    .eq('user_id', user.id)

  console.log("\n¡Pago verificado simulado con éxito! Recarga la página y deberías ver el estado actualizado.")
  process.exit(0)
}

verifyPayment()
