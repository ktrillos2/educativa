import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/utils/supabase/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

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

      if (order.email) {
        // Enviar correo de felicitaciones con el enlace de descarga
        const certificateUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/diplomados/${courseId}/certificado`
        
        await resend.emails.send({
          from: 'Academia Lideres del Merito <pagos@lideresdelmerito.edu.co>',
          to: order.email,
          subject: `¡Certificado Desbloqueado! - ${order.program_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #006838;">¡Felicidades ${order.student_name}!</h2>
              <p>Hemos recibido el pago de tu certificado exitosamente.</p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Programa:</strong> ${order.program_name}</p>
                <p style="margin: 5px 0;"><strong>Referencia de Pago:</strong> ${reference}</p>
                <p style="margin: 5px 0;"><strong>Total Pagado:</strong> $${(order.amount / 100).toLocaleString('es-CO')}</p>
              </div>
              <p>Ya puedes acceder a tu Certificado oficial y Acta de finalización académica desde nuestro portal estudiantil.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${certificateUrl}" style="background-color: #C5A059; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Descargar Certificado
                </a>
              </div>
              <hr style="border-top: 1px solid #e2e8f0;" />
              <p style="color: #64748b; font-size: 12px; text-align: center;">Academia de Formación Líderes del Mérito S.A.S.</p>
            </div>
          `
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Wompi Webhook Error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
