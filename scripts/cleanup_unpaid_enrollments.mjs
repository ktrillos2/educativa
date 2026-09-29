/**
 * Script: cleanup_unpaid_enrollments.mjs
 * Descripción: Elimina todos los registros de enrollments donde payment_verified = false.
 * Estos son registros "huérfanos" creados antes de que el pago fuera confirmado.
 * Ejecutar UNA SOLA VEZ para limpiar la base de datos.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function cleanup() {
  // 1. Mostrar cuántos enrollments sin pago existen
  const { data: unpaid, error: fetchError } = await supabase
    .from('enrollments')
    .select('id, user_id, course_id, created_at')
    .eq('payment_verified', false)

  if (fetchError) {
    console.error('Error fetching unpaid enrollments:', fetchError)
    return
  }

  if (!unpaid || unpaid.length === 0) {
    console.log('✅ No hay enrollments sin pago verificado. La base de datos está limpia.')
    return
  }

  console.log(`⚠️  Se encontraron ${unpaid.length} enrollments sin pago:`)
  unpaid.forEach(e => {
    console.log(`  - user_id: ${e.user_id} | course_id: ${e.course_id} | created_at: ${e.created_at}`)
  })

  // 2. Eliminar todos los enrollments sin pago verificado
  const { error: deleteError, count } = await supabase
    .from('enrollments')
    .delete({ count: 'exact' })
    .eq('payment_verified', false)

  if (deleteError) {
    console.error('Error eliminando enrollments:', deleteError)
    return
  }

  console.log(`\n✅ Se eliminaron ${count} enrollments sin pago verificado.`)
  console.log('   La plataforma ya no mostrará cursos a alumnos con pago pendiente.')
}

cleanup()
