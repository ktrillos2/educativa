import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import fs from "fs"
import path from "path"

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ filename: string }> }
) {
    const { filename } = await context.params
    const session = await getSession()

    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const isMockPaid = cookieStore.get("mock_paid")?.value === "true"

    if (!isMockPaid) {
        if (!session?.userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const courseId = searchParams.get("courseId")

        // Material is free for enrolled users
        const sql = courseId 
            ? "SELECT user_id FROM enrollments WHERE user_id = ? AND course_id = ?"
            : "SELECT user_id FROM enrollments WHERE user_id = ?"
        
        const args = courseId ? [session.userId, courseId] : [session.userId]

        const userEnrollments = await db.execute({ sql, args })

        if (userEnrollments.rows.length === 0) {
            return new NextResponse("Enrollment Required", { status: 403 })
        }
    }

    const filePath = path.join(process.cwd(), "diplomados", filename)

    if (!fs.existsSync(filePath)) {
        return new NextResponse("File not found", { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)

    const ext = path.extname(filename).toLowerCase()
    let contentType = "application/octet-stream"

    if (ext === ".pdf") {
        contentType = "application/pdf"
    } else if (ext === ".doc" || ext === ".docx") {
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": `inline; filename="${filename}"`,
        },
    })
}
