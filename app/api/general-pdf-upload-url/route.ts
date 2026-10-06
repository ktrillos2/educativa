import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"

const BUCKET_NAME = "course-modules"

/**
 * POST /api/general-pdf-upload-url
 * Genera una URL firmada para subir PDFs de información general o de cursos,
 * evitando el límite de 4.5 MB de Vercel.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const body = await request.json()
    const { type, courseId } = body // "diplomados" | "etdh" | "course"

    if (!type) {
      return NextResponse.json({ error: "Falta el tipo de documento." }, { status: 400 })
    }

    let destinationPath = ""
    const timestamp = body.ts || Date.now()
    if (type === "course") {
      if (!courseId) return NextResponse.json({ error: "Falta courseId." }, { status: 400 })
      destinationPath = `${courseId}/info-${timestamp}.pdf`
    } else if (type === "etdh") {
      destinationPath = `info/general-etdh-${timestamp}.pdf`
    } else {
      destinationPath = `info/general-diplomados-${timestamp}.pdf`
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(destinationPath)

    if (error || !data?.signedUrl) {
      console.error("[general-pdf-upload-url] Error generando signed URL:", error)
      return NextResponse.json(
        { error: `No se pudo generar la URL de subida: ${error?.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      destinationPath,
    })
  } catch (err: any) {
    console.error("[general-pdf-upload-url] Error:", err)
    return NextResponse.json(
      { error: `Error interno: ${err?.message || "desconocido"}` },
      { status: 500 }
    )
  }
}
