import { NextResponse } from "next/server"
import { createAdminClient } from "@/utils/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("platform_settings").select("*")
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ settings: data })
}
