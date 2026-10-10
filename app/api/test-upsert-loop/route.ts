import { NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createAdminClient()
  const ts = Date.now()
  const viewerUrl = `/api/file/${encodeURIComponent(`General - diplomados - ${ts}.pdf`)}`
  const keysToSave = ["info_diplomados_pdf", "info_diplomados", "general_diplomados_pdf", "info_diplomados_url"]

  const results = []
  
  for (const key of keysToSave) {
    const { error: upsertErr } = await supabase
      .from("platform_settings")
      .upsert(
        { key, value: viewerUrl, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      )
    
    if (upsertErr) {
      results.push({ key, error: upsertErr })
    } else {
      results.push({ key, success: true })
    }
  }

  // Verificar si se guardaron
  const { data: verifyData } = await supabase.from("platform_settings").select("*").in("key", keysToSave)
  
  // Limpiar
  await supabase.from("platform_settings").delete().in("key", keysToSave)

  return NextResponse.json({ results, verifyData })
}
