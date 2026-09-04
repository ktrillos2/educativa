"use server"

import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createTopic(title: string, content: string, courseId: string | null = null) {
    const session = await getSession()
    if (!session?.userId) return { success: false, error: "No autorizado" }

    const supabase = await createClient()

    const { data, error } = await supabase
        .from("forum_topics")
        .insert({
            title,
            content,
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
