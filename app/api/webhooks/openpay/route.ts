import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Openpay events have a "type" and a "transaction" object
    const eventType = body.type
    const transaction = body.transaction

    if (!transaction || !transaction.order_id) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
    }

    if (eventType === 'charge.succeeded') {
      const reference = transaction.order_id // This is our order's reference
      const supabase = await createClient()

      // 1. Find the order by reference
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('reference', reference)
        .maybeSingle()

      if (orderError || !order) {
        console.error('Order not found for reference:', reference)
        return NextResponse.json({ error: 'Order no encontrada' }, { status: 404 })
      }

      // 2. Update order status to PAID
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({ 
          status: 'PAID',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id)

      if (updateOrderError) {
        console.error('Error updating order:', updateOrderError)
        return NextResponse.json({ error: 'Error actualizando orden' }, { status: 500 })
      }

      // 3. Crear o actualizar enrollment con payment_verified = true (upsert)
      // El enrollment se crea aquí por primera vez si el usuario no existía antes en la tabla,
      // garantizando que SOLO se inscribe cuando el pago fue confirmado por Openpay.
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', order.user_id)
        .eq('course_id', order.course_id)
        .maybeSingle()

      let updateEnrollmentError = null
      if (existingEnrollment) {
        const { error } = await supabase
          .from('enrollments')
          .update({ payment_verified: true })
          .eq('id', existingEnrollment.id)
        updateEnrollmentError = error
      } else {
        const { error } = await supabase
          .from('enrollments')
          .insert({
            user_id: order.user_id,
            course_id: order.course_id,
            payment_verified: true
          })
        updateEnrollmentError = error
      }

      if (updateEnrollmentError) {
        console.error('Error updating enrollment:', updateEnrollmentError)
        return NextResponse.json({ error: 'Error actualizando matricula' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Pago procesado y verificado con éxito' })
    }

    // Si es otro tipo de evento (e.g. charge.failed, charge.created), simplemente devolvemos 200 OK para que Openpay sepa que lo recibimos
    return NextResponse.json({ success: true, message: 'Evento recibido pero no procesado' })

  } catch (error) {
    console.error('Openpay Webhook Error:', error)
    return NextResponse.json({ error: 'Error procesando el webhook' }, { status: 500 })
  }
}
