import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"

const MAX_SIZE_MB = 50
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]
const BUCKET = "videos"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const slot = formData.get("slot") as string | null // "0" | "1" | "2"

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Formato no permitido. Usa MP4, WebM, OGG o MOV.` },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `El archivo supera el límite de ${MAX_SIZE_MB} MB.` },
        { status: 400 }
      )
    }

    const slotIndex = slot ?? "0"
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4"
    const filename = `promo-video-${slotIndex}-${Date.now()}.${ext}`

    const buffer = await file.arrayBuffer()

    const supabase = createAdminClient()

    // Subir a Supabase Storage (bucket "videos", carpeta "promo")
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(`promo/${filename}`, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error("Error subiendo video a Storage:", uploadError)
      return NextResponse.json(
        { error: "Error al subir el video. Intenta de nuevo." },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: publicData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(`promo/${filename}`)

    const publicUrl = publicData.publicUrl

    return NextResponse.json({ success: true, url: publicUrl })
  } catch (err: any) {
    console.error("Error en /api/upload-video:", err)
    return NextResponse.json(
      { error: `Error interno: ${err?.message ?? "desconocido"}` },
      { status: 500 }
    )
  }
}
