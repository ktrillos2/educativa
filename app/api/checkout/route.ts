import { NextResponse } from 'next/server'

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
    const reference = `CERT-${crypto.randomUUID().substring(0, 8).toUpperCase()}-${Date.now()}`

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

    // Configuración de Openpay
    const merchantId = process.env.OPENPAY_MERCHANT_ID
    const privateKey = process.env.OPENPAY_PRIVATE_KEY

    if (!merchantId || !privateKey) {
      console.error('Faltan las credenciales de Openpay en el entorno')
      return NextResponse.json({ error: 'Configuración de pagos incompleta' }, { status: 500 })
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const redirectUrl = `${origin}/estudiante/certificados`

    const cleanProgramName = programName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s-]/g, "")
    
    const openpayPayload = {
      method: "card",
      confirm: false,
      amount: parseInt(amount, 10) / 100, // Openpay espera decimales, Wompi usaba centavos. Si es 150000000 cents -> 1500000 COP
      currency: "COP",
      description: `Certificado Academico - ${cleanProgramName}`.substring(0, 250),
      order_id: reference,
      redirect_url: redirectUrl,
      customer: {
        name: user.name.substring(0, 250),
        last_name: ".", // Required field for some regions
        email: user.email,
        phone_number: user.phone || "0000000000"
      },
      send_email: false // Openpay enviará recibo si es true
    }

    // Llamada a la API de Openpay (Colombia usa /charges para Hosted Checkout)
    const openpayRes = await fetch(`https://sandbox-api.openpay.co/v1/${merchantId}/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`
      },
      body: JSON.stringify(openpayPayload)
    })

    const openpayData = await openpayRes.json()

    if (!openpayRes.ok) {
      console.error('Error desde Openpay:', openpayData)
      return NextResponse.json({ error: 'Error al comunicarse con la pasarela de pagos' }, { status: 502 })
    }

    // Retornamos el link de checkout para redirigir al usuario
    const checkoutLink = openpayData.payment_method?.url || openpayData.checkout_link
    
    if (!checkoutLink) {
      console.error('URL de redirección no encontrada en la respuesta de Openpay:', openpayData)
      return NextResponse.json({ error: 'La pasarela no retornó el link de pago' }, { status: 502 })
    }

    return NextResponse.json({ 
      reference, 
      success: true,
      checkoutUrl: checkoutLink
    })
  } catch (error) {
    console.error('Error creating checkout order:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud de pago' }, { status: 500 })
  }
}
