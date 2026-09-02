import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyAllPayments() {
  console.log("Forzando actualización de ABSOLUTAMENTE TODAS las inscripciones a payment_verified = true...")

  // En lugar de buscar los que están "false", los actualizamos todos
  // sin importar si estaban en "null" (vacíos por registros antiguos)
  const { data: enrollments, error: fetchError } = await supabaseAdmin
    .from('enrollments')
    .select('id, payment_verified')

  if (fetchError) {
    console.error("Error al obtener las inscripciones:", fetchError)
    return
  }

  let count = 0;
  for (const enrollment of enrollments || []) {
      if (enrollment.payment_verified !== true) {
          const { error } = await supabaseAdmin
            .from('enrollments')
            .update({ payment_verified: true })
            .eq('id', enrollment.id)
            
          if (!error) count++;
      }
  }

  console.log(`\n¡Se forzó la actualización a verificado de ${count} inscripciones restantes con éxito!`)
  process.exit(0)
}

verifyAllPayments()
