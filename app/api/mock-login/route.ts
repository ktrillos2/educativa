import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const userId = "mock-user-no-db"
        // await createSession(userId) // Deprecated

        // Emulate that this user has paid for everything by setting a special cookie
        const cookieStore = await cookies()
        cookieStore.set("mock_paid", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        })

        return NextResponse.redirect(new URL("/diplomados", "http://localhost:3000"))
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Failed to create mock user", details: e })
    }
}

