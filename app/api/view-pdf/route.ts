import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")
    const courseId = searchParams.get("courseId")
    const rawUrl = searchParams.get("url")

    let targetUrl: string | null = rawUrl

    const supabase = createAdminClient()

    // If key or courseId is provided, query platform_settings
    if (!targetUrl && (key || courseId)) {
      const keysToTry: string[] = []
      if (key) keysToTry.push(key)
      if (courseId) {
        keysToTry.push(`course_pdf_${courseId}`)
        keysToTry.push(`course_info_${courseId}`)
        const slug = courseId.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        keysToTry.push(`course_pdf_${slug}`)
        keysToTry.push(`course_info_${slug}`)
      }

      for (const k of keysToTry) {
        const { data } = await supabase
          .from("platform_settings")
          .select("value")
          .eq("key", k)
          .maybeSingle()

        if (data?.value && typeof data.value === "string") {
          targetUrl = data.value.trim()
          break
        }
      }
    }

    if (!targetUrl) {
      return new NextResponse("Documento PDF no encontrado.", { status: 404 })
    }

    // 1. Handle Base64 Data URL
    if (targetUrl.startsWith("data:application/pdf;base64,")) {
      const base64Data = targetUrl.replace("data:application/pdf;base64,", "")
      const buffer = Buffer.from(base64Data, "base64")

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="documento.pdf"',
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "public, max-age=3600",
        },
      })
    }

    // 2. Handle HTTP / Supabase Storage URL
    if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
      const pdfRes = await fetch(targetUrl)
      if (!pdfRes.ok) {
        return new NextResponse("No se pudo obtener el archivo PDF de la fuente externa.", { status: 502 })
      }

      const arrayBuffer = await pdfRes.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="documento.pdf"',
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "public, max-age=3600",
        },
      })
    }

    return new NextResponse("Formato de URL de PDF no válido.", { status: 400 })
  } catch (err: any) {
    console.error("Error en /api/view-pdf:", err)
    return new NextResponse("Error del servidor al cargar el PDF.", { status: 500 })
  }
}
