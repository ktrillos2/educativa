"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"

export async function getSettings(key: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", key)
    .single()

  if (error || !data) {
    return null
  }

  return data.value
}

export async function saveSettings(key: string, value: any) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from("platform_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })

  if (error) {
    console.error("Error saving settings:", error)
    return { error: "No se pudieron guardar las configuraciones." }
  }

  // Revalidar las rutas que puedan depender de estas configuraciones
  revalidatePath("/admin/videos")
  revalidatePath("/diplomados")
  revalidatePath("/")
  
  return { success: true }
}
