import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { client } from '@/sanity/lib/client'
import { Resend } from 'resend'
import { db } from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY)
const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // const signature = request.headers.get('x-event-checksum') // Checksum integration omitted for simplicity in this template

    if (!body || !body.data || !body.data.transaction) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { transaction } = body.data
    const reference = transaction.reference
    const status = transaction.status // 'APPROVED', 'DECLINED', 'ERROR'
    const transactionId = transaction.id

    // 1. Find the order in Sanity by reference
    const query = `*[_type == "order" && reference == $reference][0]`
    const order = await client.fetch(query, { reference })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // 2. Update Order in Sanity
    await client
      .patch(order._id)
      .set({ status, wompiTransactionId: transactionId })
      .commit()

    // 3. If APPROVED, unlock the certificate in SQLite and send Email
    if (status === 'APPROVED') {
      const { userId, courseId } = order

      if (userId && courseId) {
        await db.execute({
          sql: "UPDATE enrollments SET payment_verified = 1 WHERE user_id = ? AND course_id = ?",
          args: [userId, courseId]
        })
      }

      if (order.email) {
        // Enviar correo de felicitaciones con el enlace de descarga
        const certificateUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/diplomados/${courseId}/certificado`
        
        await resend.emails.send({
          from: 'Academia Lideres del Merito <pagos@lideresdelmerito.edu.co>',
          to: order.email,
          subject: `¡Certificado Desbloqueado! - ${order.programName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #006838;">¡Felicidades ${order.studentName}!</h2>
              <p>Hemos recibido el pago de tu certificado exitosamente.</p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Programa:</strong> ${order.programName}</p>
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
