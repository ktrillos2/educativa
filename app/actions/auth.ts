"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    document: z.string().min(5, "Document must be valid"),
    phone: z.string().min(7, "Phone number must be valid"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
})

export async function registerAction(data: z.infer<typeof registerSchema>, courseId?: string) {
    try {
        const validatedData = registerSchema.parse(data)
        const supabase = await createClient()

        // 1. Check if user with same document exists in our public.users table 
        const { data: existingDoc } = await supabase
            .from("users")
            .select("id")
            .eq("document", validatedData.document)
            .single()

        if (existingDoc) {
            return { error: "Un usuario con este documento ya existe." }
        }

        // 2. Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: validatedData.email,
            password: validatedData.password,
        })

        if (authError) {
            return { error: authError.message }
        }

        if (!authData.user) {
            return { error: "No se pudo crear el usuario." }
        }

        const userId = authData.user.id

        // 3. Insert extra data into public.users
        const { error: profileError } = await supabase
            .from("users")
            .insert({
                id: userId,
                name: validatedData.name,
                document: validatedData.document,
                phone: validatedData.phone,
                email: validatedData.email,
                role: 'user'
            })

        if (profileError) {
            console.error("Profile creation error:", profileError)
            return { error: "Error al crear el perfil del usuario." }
        }

        // 4. Attempt to enroll if courseId provided
        if (courseId) {
            await supabase
                .from("enrollments")
                .insert({
                    user_id: userId,
                    course_id: courseId,
                    payment_verified: false
                })
        }

        revalidatePath("/")
        return { success: true }
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message }
        }
        return { error: "Failed to register" }
    }
}

export async function enrollAction(courseId: string, formData: FormData) {
    return { error: "Not implemented. Use registerAction directly or login then enroll." }
}

export async function loginAction(data: z.infer<typeof loginSchema>) {
    try {
        const validatedData = loginSchema.parse(data)
        const supabase = await createClient()

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: validatedData.email,
            password: validatedData.password,
        })

        if (error) {
            return { error: "Credenciales inválidas" }
        }

        // Fetch the role to allow client-side redirect to the correct dashboard
        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", authData.user.id)
            .single()

        revalidatePath("/")
        return { success: true, role: profile?.role ?? "user" }
    } catch (error: any) {
        return { error: "Failed to login" }
    }
}

export async function logoutAction() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/")
    return { success: true }
}
