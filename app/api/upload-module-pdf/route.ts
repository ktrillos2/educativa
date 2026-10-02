import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

/**
 * POST /api/upload-module-pdf
 * Confirma que el PDF fue subido directamente a Supabase desde el cliente
 * y actualiza el registro en la base de datos.
 * No recibe el archivo — solo JSON con courseId y moduleIndex.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, moduleIndex } = body

    console.log(`[upload-module-pdf] Confirmando subida — courseId=${courseId}, moduleIndex=${moduleIndex}`)

    if (!courseId || !moduleIndex) {
      return NextResponse.json({ error: "Faltan courseId o moduleIndex." }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Actualizar module_pdfs en la BD
    const { data: courseData, error: fetchError } = await supabase
      .from("courses")
      .select("module_pdfs, modules")
      .eq("id", courseId)
      .maybeSingle()

    if (fetchError || !courseData) {
      console.error("[upload-module-pdf] Curso no encontrado:", fetchError)
      return NextResponse.json({ error: "No se encontró el curso en la base de datos." }, { status: 404 })
    }

    const currentPdfs = (courseData.module_pdfs as Record<string, boolean>) || {}
    currentPdfs[`mod-${moduleIndex}`] = true
    const newModulesCount = Math.max(courseData.modules || 0, moduleIndex)

    const { error: updateError } = await supabase
      .from("courses")
      .update({ module_pdfs: currentPdfs, modules: newModulesCount } as any)
      .eq("id", courseId)

    if (updateError) {
      console.error("[upload-module-pdf] Error actualizando BD:", updateError)
      return NextResponse.json(
        { error: `Error al actualizar la base de datos: ${updateError.message}` },
        { status: 500 }
      )
    }

    try {
      revalidatePath(`/admin/cursos`)
      revalidatePath(`/admin/cursos/${courseId}/modulos`)
      revalidatePath(`/diplomados/${courseId}`)
      revalidatePath(`/formacion-academica/${courseId}`)
      revalidatePath(`/estudiante/cursos/${courseId}`)
    } catch (revalidateErr) {
      console.warn("[upload-module-pdf] revalidatePath falló (no crítico):", revalidateErr)
    }

    const elapsed = Date.now() - startTime
    const targetFileName = `Modulo ${moduleIndex} - ${courseId}.pdf`
    console.log(`[upload-module-pdf] BD actualizada en ${elapsed}ms. Archivo: ${targetFileName}`)

    return NextResponse.json({
      success: true,
      message: `El archivo ${targetFileName} fue cargado correctamente.`,
      moduleIndex,
      fileName: targetFileName,
    })
  } catch (err: any) {
    const elapsed = Date.now() - startTime
    console.error(`[upload-module-pdf] Error crítico tras ${elapsed}ms:`, err)
    return NextResponse.json(
      { error: `Error interno: ${err?.message || "Error desconocido"}` },
      { status: 500 }
    )
  }
}
