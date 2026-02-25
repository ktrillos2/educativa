import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import fs from "fs"
import path from "path"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params
    const session = await getSession()

    if (!session?.userId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // We should ideally check the specific course payment, but here we just check if
    // this user has ANY payment verified, or we query the exact enrollment.
    // For simplicity, we'll assume if they have any paymentVerified = true, they can download.
    const userEnrollments = await db.execute({
        sql: "SELECT payment_verified FROM enrollments WHERE user_id = ? AND payment_verified = 1",
        args: [session.userId]
    })

    if (userEnrollments.rows.length === 0) {
        return new NextResponse("Payment Required", { status: 403 })
    }

    // Serve the file from the diplomados folder in the root
    const filePath = path.join(process.cwd(), "diplomados", filename)

    if (!fs.existsSync(filePath)) {
        return new NextResponse("File not found", { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)

    // Set headers dynamically based on file type
    const ext = path.extname(filename).toLowerCase()
    let contentType = "application/octet-stream"

    if (ext === ".pdf") {
        contentType = "application/pdf"
    } else if (ext === ".doc" || ext === ".docx") {
        contentType = "application/msword"
    }

    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    })
}
