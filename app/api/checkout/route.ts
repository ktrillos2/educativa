import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/lib/auth'
import { createClient } from '@/utils/supabase/server'

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

    const supabase = await createClient()

    // Obtener datos del usuario desde Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("name, email, document, phone")
      .eq("id", session.userId)
      .maybeSingle()

    if (userError || !user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Validar si ya pagó
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("payment_verified")
      .eq("user_id", session.userId)
      .eq("course_id", courseId)
      .maybeSingle()

    if (enrollment && enrollment.payment_verified) {
      return NextResponse.json({ error: 'El certificado ya se encuentra pagado y desbloqueado' }, { status: 400 })
    }

    // Generar referencia única
    const reference = `CERT-${uuidv4().substring(0, 8).toUpperCase()}-${Date.now()}`

    // Crear la orden en la tabla orders de Supabase
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        reference,
        user_id: session.userId,
        course_id: courseId,
        student_name: user.name,
        email: user.email,
        document_id: user.document,
        phone: user.phone || '',
        program_name: programName,
        amount: parseInt(amount, 10),
        status: 'PENDING'
      })

    if (orderError) {
      console.error('Error creating order in database:', orderError)
      return NextResponse.json({ error: 'Error al registrar la orden de pago' }, { status: 500 })
    }

    return NextResponse.json({ reference, success: true })
  } catch (error) {
    console.error('Error creating checkout order:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud de pago' }, { status: 500 })
  }
}
