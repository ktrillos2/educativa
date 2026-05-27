import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { client } from '@/sanity/lib/client'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, programName, amount } = body

    if (!courseId || !programName || !amount) {
      return NextResponse.json({ error: 'Faltan datos requeridos del curso' }, { status: 400 })
    }

    // Obtener datos del usuario desde SQLite
    const userResult = await db.execute({
      sql: "SELECT name, email, document, phone FROM users WHERE id = ?",
      args: [session.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const user = userResult.rows[0]

    // Validar si ya pagó
    const enrollment = await db.execute({
      sql: "SELECT payment_verified FROM enrollments WHERE user_id = ? AND course_id = ?",
      args: [session.userId, courseId]
    })

    if (enrollment.rows.length > 0 && enrollment.rows[0].payment_verified) {
      return NextResponse.json({ error: 'El certificado ya se encuentra pagado y desbloqueado' }, { status: 400 })
    }

    // Generate unique reference
    const reference = `CERT-${uuidv4().substring(0, 8).toUpperCase()}-${Date.now()}`

    // Create Sanity Document
    const newOrder = {
      _type: 'order',
      reference,
      userId: session.userId,
      courseId,
      studentName: String(user.name),
      email: String(user.email),
      documentId: String(user.document),
      phone: String(user.phone || ''), // Teléfono puede ser opcional
      programName,
      amount: parseInt(amount, 10), // in cents for Wompi
      status: 'PENDING',
    }

    await client.create(newOrder)

    return NextResponse.json({ reference, success: true })
  } catch (error) {
    console.error('Error creating checkout order:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud de pago' }, { status: 500 })
  }
}
