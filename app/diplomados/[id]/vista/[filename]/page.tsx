import { Breadcrumb } from "@/components/breadcrumb"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DocumentViewerPage(props: { params: Promise<{ id: string, filename: string }> }) {
    const params = await props.params
    const session = await getSession()
    if (!session?.userId) {
        redirect(`/diplomados/${params.id}`)
    }

    return (
        <main className="flex-grow pt-24 bg-muted/20 pb-12">
            <div className="container mx-auto px-4 h-[80vh] flex flex-col">
                <div className="mb-6">
                    <Breadcrumb items={[
                        { label: "Inicio", href: "/" },
                        { label: "Diplomados", href: "/diplomados" },
                        { label: "Volver", href: `/diplomados/${params.id}` },
                        { label: decodeURIComponent(params.filename) }
                    ]} />
                </div>

                <div className="flex-grow bg-white shadow-sm border border-border overflow-hidden">
                    <iframe
                        src={`/api/file/${params.filename}?courseId=${params.id}#toolbar=0&navpanes=0`}
                        className="w-full h-full border-none"
                        title={decodeURIComponent(params.filename)}
                    />
                </div>
            </div>
        </main>
    )
}
