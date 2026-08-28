import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body || !body.data || !body.data.transaction) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { transaction } = body.data
    const reference = transaction.reference
    const status = transaction.status // 'APPROVED', 'DECLINED', 'ERROR'
    const transactionId = transaction.id

    // Usar cliente admin para poder actualizar RLS si es un webhook externo
    const supabase = createAdminClient()

    // 1. Buscar la orden en Supabase por referencia
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("reference", reference)
      .maybeSingle()

    if (orderError || !order) {
      console.error('Order search error or order not found:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // 2. Actualizar Orden en Supabase
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({
        status,
        wompi_transaction_id: transactionId
      })
      .eq("id", order.id)

    if (updateOrderError) {
      console.error('Error updating order status:', updateOrderError)
    }

    // 3. Si es APPROVED, desbloquear el certificado en Supabase y enviar email
    if (status === 'APPROVED') {
      const userId = order.user_id
      const courseId = order.course_id

      if (userId && courseId) {
        const { error: updateEnrollmentError } = await supabase
          .from("enrollments")
          .update({ payment_verified: true })
          .eq("user_id", userId)
          .eq("course_id", courseId)

        if (updateEnrollmentError) {
          console.error('Error updating enrollment payment status:', updateEnrollmentError)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Wompi Webhook Error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
