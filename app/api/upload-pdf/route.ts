import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

/**
 * POST /api/upload-pdf
 * Confirma la subida del PDF (hecha directamente al storage desde el cliente)
 * y guarda la URL en platform_settings.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const body = await request.json()
    const { type, courseId, ts } = body // "diplomados" | "etdh" | "course"

    if (type === "course" && !courseId) {
      return NextResponse.json(
        { error: "Debes proporcionar un courseId para cursos." },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    let viewerUrl = ""
    let primaryKey = ""

    if (type === "course") {
      viewerUrl = ts ? `/api/file/${encodeURIComponent(`Info - ${courseId} - ${ts}.pdf`)}` : `/api/file/${encodeURIComponent(`Info - ${courseId}.pdf`)}`
      primaryKey = `course_pdf_${courseId}`
    } else if (type === "etdh") {
      viewerUrl = ts ? `/api/file/General - etdh - ${ts}.pdf` : "/api/file/General - etdh.pdf"
      primaryKey = "info_etdh_pdf"
    } else {
      viewerUrl = ts ? `/api/file/General - diplomados - ${ts}.pdf` : "/api/file/General - diplomados.pdf"
      primaryKey = "info_diplomados_pdf"
    }

    const keysToSave = [primaryKey]
    if (type === "course" && courseId) {
      keysToSave.push(`course_info_${courseId}`)
      const slugId = slugify(courseId)
      if (slugId !== courseId) {
        keysToSave.push(`course_pdf_${slugId}`)
        keysToSave.push(`course_info_${slugId}`)
      }
    }

    // Actualizar base de datos
    for (const key of keysToSave) {
      await supabase
        .from("platform_settings")
        .upsert(
          { key, value: viewerUrl, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        )
    }

    // Revalidaciones no críticas
    try {
      revalidatePath("/diplomados", "page")
      revalidatePath("/formacion-academica", "page")
      revalidatePath("/admin/configuracion", "page")
      revalidatePath("/diplomados/[id]", "page")
      revalidatePath("/formacion-academica/[id]", "page")
      if (courseId) {
        revalidatePath(`/admin/cursos/${courseId}/editar`, "page")
        revalidatePath(`/admin/cursos/${courseId}/modulos`, "page")
      }
    } catch (e) {
      console.warn("Revalidación fallida:", e)
    }

    return NextResponse.json({
      success: true,
      pdfUrl: viewerUrl,
      key: primaryKey,
      message: "¡PDF guardado y publicado exitosamente!",
    })
  } catch (err: any) {
    console.error("Error crítico en /api/upload-pdf:", err)
    return NextResponse.json(
      { error: `[Error Servidor] ${err?.message || "Error interno al procesar el archivo."}` },
      { status: 500 }
    )
  }
}

