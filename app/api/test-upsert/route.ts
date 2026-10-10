import { NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from("platform_settings")
    .upsert(
      { key: "test_upsert_key", value: "test", updated_at: new Date().toISOString() },
      { onConflict: "key" }
    )
    .select()
    
  // Clean up
  await supabase.from("platform_settings").delete().eq("key", "test_upsert_key")
  
  if (error) {
    return NextResponse.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 })
  }
  
  return NextResponse.json({ success: true, data })
}
