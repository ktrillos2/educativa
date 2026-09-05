"use server"

import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createTopic(title: string, content: string, category: string, courseId: string | null = null) {
    const session = await getSession()
    if (!session?.userId) return { success: false, error: "No autorizado" }

    const supabase = await createClient()

    const { data, error } = await supabase
        .from("forum_topics")
        .insert({
            title,
            content,
            category,
            course_id: courseId,
            user_id: session.userId
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating topic:", error)
        return { success: false, error: error.message }
    }

    if (courseId) {
        revalidatePath(`/estudiante/cursos/${courseId}`)
    } else {
        revalidatePath("/estudiante/comunidad")
    }

    return { success: true, topic: data }
}

export async function createReply(topicId: string, content: string, courseId: string | null = null) {
    const session = await getSession()
    if (!session?.userId) return { success: false, error: "No autorizado" }

    const supabase = await createClient()

    const { error } = await supabase
        .from("forum_replies")
        .insert({
            topic_id: topicId,
            content,
            user_id: session.userId
        })

    if (error) {
        console.error("Error creating reply:", error)
        return { success: false, error: error.message }
    }

    if (courseId) {
        revalidatePath(`/estudiante/cursos/${courseId}`)
        revalidatePath(`/estudiante/cursos/${courseId}/foro/${topicId}`)
    } else {
        revalidatePath("/estudiante/comunidad")
        revalidatePath(`/estudiante/comunidad/tema/${topicId}`)
    }

    return { success: true }
}

export async function deleteTopic(topicId: string, courseId: string | null = null) {
    const session = await getSession()
    if (!session?.userId) return { success: false, error: "No autorizado" }

    // Use admin client to allow admins to delete any topic
    const supabase = session.role === 'admin' ? createAdminClient() : await createClient()
    
    const { error } = await supabase
        .from("forum_topics")
        .delete()
        .eq("id", topicId)
        // If not admin, RLS will enforce that they own the topic (if using standard client)
        // Actually, if using admin client it bypasses RLS, which is what we want for admins.

    if (error) {
        console.error("Error deleting topic:", error)
        return { success: false, error: error.message }
    }

    if (courseId) {
        revalidatePath(`/estudiante/cursos/${courseId}`)
    } else {
        revalidatePath("/estudiante/comunidad")
    }

    return { success: true }
}

export async function deleteReply(replyId: string, topicId: string, courseId: string | null = null) {
    const session = await getSession()
    if (!session?.userId) return { success: false, error: "No autorizado" }

    const supabase = session.role === 'admin' ? createAdminClient() : await createClient()
    
    const { error } = await supabase
        .from("forum_replies")
        .delete()
        .eq("id", replyId)

    if (error) {
        console.error("Error deleting reply:", error)
        return { success: false, error: error.message }
    }

    if (courseId) {
        revalidatePath(`/estudiante/cursos/${courseId}/foro/${topicId}`)
    } else {
        revalidatePath(`/estudiante/comunidad/tema/${topicId}`)
    }

    return { success: true }
}

// NUEVAS FUNCIONALIDADES DE MODERACIÓN E INTERACCIÓN

export async function togglePinTopic(topicId: string, currentState: boolean, courseId: string | null = null) {
    const session = await getSession()
    if (!session || session.role !== 'admin') return { success: false, error: "No autorizado" }

    const supabase = createAdminClient()
    const { error } = await supabase
        .from("forum_topics")
        .update({ is_pinned: !currentState })
        .eq("id", topicId)

    if (error) return { success: false, error: error.message }

    if (courseId) {
        revalidatePath(`/estudiante/cursos/${courseId}/foro`)
    } else {
        revalidatePath("/estudiante/comunidad")
    }
    return { success: true }
}

export async function toggleResolveTopic(topicId: string, currentState: boolean, courseId: string) {
    const session = await getSession()
    if (!session) return { success: false, error: "No autorizado" }

    const supabase = session.role === 'admin' ? createAdminClient() : await createClient()
    
    // Check ownership if not admin
    if (session.role !== 'admin') {
        const { data: topic } = await supabase.from("forum_topics").select("user_id").eq("id", topicId).single()
        if (topic?.user_id !== session.userId) return { success: false, error: "Solo el autor o un admin puede resolver el tema" }
    }

    const { error } = await supabase
        .from("forum_topics")
        .update({ is_resolved: !currentState })
        .eq("id", topicId)

    if (error) return { success: false, error: error.message }

    revalidatePath(`/estudiante/cursos/${courseId}/foro`)
    revalidatePath(`/estudiante/cursos/${courseId}/foro/${topicId}`)
    return { success: true }
}

export async function incrementTopicViews(topicId: string) {
    // Para simplificar, traemos el valor actual y le sumamos 1.
    // Idealmente se usa una función RPC en Supabase para evitar race conditions,
    // pero para fines prácticos de vista es suficiente.
    const supabase = await createClient()
    
    const { data: topic } = await supabase.from("forum_topics").select("views_count").eq("id", topicId).single()
    
    if (topic) {
        await supabase.from("forum_topics").update({ views_count: (topic.views_count || 0) + 1 }).eq("id", topicId)
    }
}
