import { createClient } from "@/utils/supabase/server"

export async function getSession() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        return null
    }

    // Buscar el rol y otros datos extra del usuario
    const { data: profile } = await supabase
        .from("users")
        .select("role, name")
        .eq("id", user.id)
        .single()

    return { 
        userId: user.id, 
        role: profile?.role || 'user',
        name: profile?.name || user.email
    }
}

