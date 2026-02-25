"use server"

import { db } from "@/lib/db"
import { createSession, endSession } from "@/lib/auth"
import bcrypt from "bcryptjs"
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

        // Check if user already exists
        const existingUser = await db.execute({
            sql: "SELECT id FROM users WHERE email = ? OR document = ?",
            args: [validatedData.email, validatedData.document],
        })

        let userId: string

        if (existingUser.rows.length > 0) {
            return { error: "User with this email or document already exists." }
        } else {
            // Create new user
            const hashedPassword = await bcrypt.hash(validatedData.password, 10)
            userId = crypto.randomUUID()

            await db.execute({
                sql: "INSERT INTO users (id, name, document, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)",
                args: [
                    userId,
                    validatedData.name,
                    validatedData.document,
                    validatedData.phone,
                    validatedData.email,
                    hashedPassword,
                ]
            })
        }

        // Attempt to enroll if courseId provided
        if (courseId) {
            await db.execute({
                sql: "INSERT INTO enrollments (id, user_id, course_id, payment_verified) VALUES (?, ?, ?, 0)",
                args: [crypto.randomUUID(), userId, courseId]
            })
        }

        await createSession(userId)
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
    // We can call this via form action if already logged in or from the dialog directly.
    return { error: "Not implemented. Use registerAction directly or login then enroll." }
}

export async function loginAction(data: z.infer<typeof loginSchema>) {
    try {
        const validatedData = loginSchema.parse(data)
        const userResult = await db.execute({
            sql: "SELECT id, password FROM users WHERE email = ?",
            args: [validatedData.email]
        })

        if (userResult.rows.length === 0) {
            return { error: "Invalid credentials" }
        }

        const user = userResult.rows[0]
        const validPassword = await bcrypt.compare(validatedData.password, user.password as string)
        if (!validPassword) {
            return { error: "Invalid credentials" }
        }

        await createSession(user.id as string)
        revalidatePath("/")
        return { success: true }
    } catch (error: any) {
        return { error: "Failed to login" }
    }
}

export async function logoutAction() {
    await endSession()
    revalidatePath("/")
    return { success: true }
}
