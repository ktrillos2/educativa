import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"

const MODULES_BUCKET = "course-modules"

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ filename: string }> }
) {
    const { filename } = await context.params
    const decodedFilename = decodeURIComponent(filename)

    const examMatch = decodedFilename.match(/^Cuestionario Modulo (\d+) - (.+)\.pdf$/i)
    const moduleMatch = decodedFilename.match(/^Modulo (\d+) - (.+?)(?: - (\d+))?\.pdf$/i)
    const infoMatch = decodedFilename.match(/^Info - (.+?)(?: - (\d+))?\.pdf$/i)
    const generalMatch = decodedFilename.match(/^General - (diplomados|etdh)(?: - (\d+))?\.pdf$/i)

    let storagePath: string | null = null

    console.log(`[API /api/file] Petición recibida: "${decodedFilename}"`)

    if (generalMatch) {
        const gType = generalMatch[1].toLowerCase()
        const ts = generalMatch[2]
        storagePath = ts ? `info/general-${gType}-${ts}.pdf` : `info/general-${gType}.pdf`
    } else if (infoMatch) {
        const courseId = infoMatch[1]
        const ts = infoMatch[2]
        storagePath = ts ? `${courseId}/info-${ts}.pdf` : `${courseId}/info.pdf`
    } else if (examMatch) {
        const moduleIndex = examMatch[1]
        const courseId = examMatch[2]
        storagePath = `${courseId}/cuestionario-modulo-${moduleIndex}.pdf`
    } else if (moduleMatch) {
        const moduleIndex = moduleMatch[1]
        const courseId = moduleMatch[2]
        const ts = moduleMatch[3]
        storagePath = ts ? `${courseId}/modulo-${moduleIndex}-${ts}.pdf` : `${courseId}/modulo-${moduleIndex}.pdf`
    }

    console.log(`[API /api/file] RUTA RESUELTA STORAGE: "${storagePath}" (Match General: ${Boolean(generalMatch)})`)

    if (!storagePath) {
        console.error(`[API /api/file] No se pudo resolver storagePath para "${decodedFilename}"`)
        return new NextResponse("File not found", { status: 404 })
    }

    // Require enrollment ONLY for internal study module PDFs or exam PDFs
    if (examMatch || moduleMatch) {
        const session = await getSession()
        const { cookies } = await import("next/headers")
        const cookieStore = await cookies()
        const isMockPaid = cookieStore.get("mock_paid")?.value === "true"

        if (!isMockPaid) {
            if (!session?.userId) {
                return new NextResponse("Unauthorized", { status: 401 })
            }

            if (session.role !== "admin") {
                const { searchParams } = new URL(request.url)
                const courseId = searchParams.get("courseId")
                const supabase = await createClient()

                let isEnrolled = false
                if (courseId) {
                    const { data } = await supabase
                        .from("enrollments")
                        .select("user_id")
                        .eq("user_id", session.userId)
                        .eq("course_id", courseId)
                        .maybeSingle()
                    if (data) isEnrolled = true
                } else {
                    const { data } = await supabase
                        .from("enrollments")
                        .select("user_id")
                        .eq("user_id", session.userId)
                        .limit(1)
                    if (data && data.length > 0) isEnrolled = true
                }

                if (!isEnrolled) {
                    return new NextResponse("Enrollment Required", { status: 403 })
                }
            }
        }
    }

    // Helper to try creating a signed URL for a given path
    const adminSupabase = createAdminClient()

    const trySignedUrl = async (path: string): Promise<string | null> => {
        const { data, error } = await adminSupabase.storage
            .from(MODULES_BUCKET)
            .createSignedUrl(path, 3600) // 1 hour
        if (error || !data?.signedUrl) return null
        return data.signedUrl
    }

    // Try the primary resolved path first
    let signedUrl = await trySignedUrl(storagePath)

    // Fallback for module PDFs: handle DB storing `true` but file saved with timestamp suffix (or vice-versa)
    if (!signedUrl && moduleMatch) {
        const moduleIndex = moduleMatch[1]
        const courseId = moduleMatch[2]
        const requestedTs = moduleMatch[3]

        if (!requestedTs) {
            // No timestamp in URL → file may have been stored WITH a timestamp suffix
            // List bucket folder and find the matching file by prefix
            const { data: listData } = await adminSupabase.storage
                .from(MODULES_BUCKET)
                .list(courseId, { search: `modulo-${moduleIndex}` })

            if (listData && listData.length > 0) {
                // Sort by most recently updated and try each candidate
                const candidates = listData
                    .filter(f => f.name.startsWith(`modulo-${moduleIndex}`) && f.name.endsWith(".pdf"))
                    .sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""))

                for (const candidate of candidates) {
                    const altPath = `${courseId}/${candidate.name}`
                    const altUrl = await trySignedUrl(altPath)
                    if (altUrl) {
                        signedUrl = altUrl
                        console.log(`[API /api/file] Fallback con timestamp encontrado: "${altPath}"`)
                        break
                    }
                }
            }
        } else {
            // Timestamp in URL → try WITHOUT timestamp as fallback
            const altPath = `${courseId}/modulo-${moduleIndex}.pdf`
            const altUrl = await trySignedUrl(altPath)
            if (altUrl) {
                signedUrl = altUrl
                console.log(`[API /api/file] Fallback sin timestamp: "${altPath}"`)
            }
        }
    }

    if (!signedUrl) {
        console.error("Error creating signed URL for storagePath:", storagePath)
        return new NextResponse("File not found", { status: 404 })
    }

    // Redirect to the signed URL with strict no-cache headers so browser never caches old PDF versions
    const res = NextResponse.redirect(signedUrl, { status: 307 })
    res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
    res.headers.set("Pragma", "no-cache")
    res.headers.set("Expires", "0")
    return res
}
