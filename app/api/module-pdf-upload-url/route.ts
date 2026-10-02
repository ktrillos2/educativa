import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"

const MODULES_BUCKET = "course-modules"

/**
 * POST /api/module-pdf-upload-url
 * Genera una URL firmada de Supabase para subir el PDF directamente desde el cliente,
 * evitando el límite de 4.5 MB de Vercel en los cuerpos de las API Routes.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, moduleIndex } = body

    if (!courseId || !moduleIndex) {
      return NextResponse.json({ error: "Faltan courseId o moduleIndex." }, { status: 400 })
    }

    const storagePath = `${courseId}/modulo-${moduleIndex}.pdf`
    const supabase = createAdminClient()

    // Generar URL firmada de subida válida por 5 minutos
    const { data, error } = await supabase.storage
      .from(MODULES_BUCKET)
      .createSignedUploadUrl(storagePath)

    if (error || !data?.signedUrl) {
      console.error("[module-pdf-upload-url] Error generando signed URL:", error)
      return NextResponse.json(
        { error: `No se pudo generar la URL de subida: ${error?.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      storagePath,
    })
  } catch (err: any) {
    console.error("[module-pdf-upload-url] Error:", err)
    return NextResponse.json(
      { error: `Error interno: ${err?.message || "desconocido"}` },
      { status: 500 }
    )
  }
}
