import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { fetchOpenpayCharge } from '@/lib/openpay'

const CHARGE_COMPLETED_STATUS = 'completed'

interface OpenpayWebhookBody {
  type?: string
  verification_code?: string
  transaction?: { id?: string; order_id?: string }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OpenpayWebhookBody

    // Openpay envía este evento al registrar el webhook en el dashboard.
    // El código aparece en los logs de Vercel y debe pegarse en el dashboard de Openpay.
    if (body.type === 'verification') {
      console.log('Openpay webhook verification_code:', body.verification_code)
      return NextResponse.json({ success: true })
    }

    if (body.type !== 'charge.succeeded') {
      return NextResponse.json({ success: true, message: 'Evento recibido pero no procesado' })
    }

    const chargeId = body.transaction?.id
    if (!chargeId) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
    }

    // No confiamos en el payload: confirmamos el cargo directamente con Openpay.
    const charge = await fetchOpenpayCharge(chargeId)
    if (!charge || charge.status !== CHARGE_COMPLETED_STATUS || !charge.order_id) {
      console.error('Openpay: cargo no verificado', chargeId, charge?.status)
      return NextResponse.json({ error: 'Cargo no verificado' }, { status: 400 })
    }

    // Webhook sin sesión de usuario → cliente admin (bypassa RLS, solo servidor).
    const supabase = createAdminClient()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id, course_id, amount, status')
      .eq('reference', charge.order_id)
      .maybeSingle()

    if (orderError || !order) {
      console.error('Order not found for reference:', charge.order_id)
      return NextResponse.json({ error: 'Order no encontrada' }, { status: 404 })
    }

    if (Number(charge.amount) < Number(order.amount)) {
      console.error('Openpay: monto inferior al de la orden', charge.order_id, charge.amount, order.amount)
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })
    }

    if (order.status !== 'PAID') {
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({ status: 'PAID', updated_at: new Date().toISOString() })
        .eq('id', order.id)

      if (updateOrderError) {
        console.error('Error updating order:', updateOrderError)
        return NextResponse.json({ error: 'Error actualizando orden' }, { status: 500 })
      }
    }

    // La inscripción se crea/activa SOLO cuando Openpay confirma el pago.
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', order.user_id)
      .eq('course_id', order.course_id)
      .maybeSingle()

    const { error: enrollmentError } = existingEnrollment
      ? await supabase.from('enrollments').update({ payment_verified: true }).eq('id', existingEnrollment.id)
      : await supabase.from('enrollments').insert({
          user_id: order.user_id,
          course_id: order.course_id,
          payment_verified: true,
        })

    if (enrollmentError) {
      console.error('Error updating enrollment:', enrollmentError)
      return NextResponse.json({ error: 'Error actualizando matricula' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Pago procesado y verificado con éxito' })
  } catch (error) {
    console.error('Openpay Webhook Error:', error)
    return NextResponse.json({ error: 'Error procesando el webhook' }, { status: 500 })
  }
}
