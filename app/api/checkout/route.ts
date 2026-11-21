import { NextResponse } from 'next/server'

import { getSession } from '@/lib/auth'
import { createClient } from '@/utils/supabase/server'
import { getOpenpayConfig } from '@/lib/openpay'

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

    // amount comes in as pesos (e.g. 460000000). Keep it as pesos.
    const amountPesos = parseInt(amount, 10)

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
        amount: amountPesos,
        status: 'PENDING'
      })

    if (orderError) {
      console.error('Error creating order in database:', orderError)
      const detail = orderError.message || orderError.details || JSON.stringify(orderError)
      return NextResponse.json({ error: `Error al registrar la orden: ${detail}` }, { status: 500 })
    }

    // Configuración de Openpay (sandbox/producción según OPENPAY_SANDBOX)
    const openpay = getOpenpayConfig()

    if (!openpay) {
      console.error('Faltan las credenciales de Openpay en el entorno')
      return NextResponse.json({ error: 'Configuración de pagos incompleta' }, { status: 500 })
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const redirectUrl = `${origin}/estudiante/certificados`

    const cleanProgramName = programName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s-]/g, "")
    
    // Separar nombre y apellido del campo name completo
    const nameParts = user.name.trim().split(" ")
    const firstName = nameParts[0].substring(0, 100)
    const lastName = nameParts.slice(1).join(" ").substring(0, 100) || "."

    const openpayPayload = {
      method: "card",
      confirm: false,
      amount: amountPesos,
      currency: "COP",
      description: `Certificado Academico - ${cleanProgramName}`.substring(0, 250),
      order_id: reference,
      redirect_url: redirectUrl,
      customer: {
        name: firstName,
        last_name: lastName,
        email: user.email,
        phone_number: (user.phone || "0000000000").replace(/\D/g, "").substring(0, 10)
      }
    }

    const openpayRes = await fetch(`${openpay.baseUrl}/v1/${openpay.merchantId}/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': openpay.authHeader
      },
      body: JSON.stringify(openpayPayload)
    })

    const openpayData = await openpayRes.json()

    if (!openpayRes.ok) {
      // Visible en los logs de Vercel: indica credenciales inválidas, entorno equivocado, etc.
      console.error('Error desde Openpay:', openpayRes.status, openpayData)
      await supabase.from("orders").update({ status: 'FAILED' }).eq("reference", reference)
      return NextResponse.json({ error: 'No fue posible iniciar el pago. Intenta de nuevo o contáctanos.' }, { status: 502 })
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
