import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import fs from "fs"
import path from "path"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params
    const session = await getSession()

    // Downloading is not permitted as per system rules
    return new NextResponse("Downloading material is not permitted. Only online viewing is allowed.", { status: 403 })

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
