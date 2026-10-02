import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MousePointerClick, ExternalLink, Download, FileText } from "lucide-react"
import { getPdfUrl } from "@/app/actions/pdf-info"

interface CoursePdfButtonProps {
  type: "diplomados" | "etdh"
  courseId: string
  courseName: string
}

export async function CoursePdfButton({ type, courseId, courseName }: CoursePdfButtonProps) {
  const slug = courseId.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  
  const coursePdfUrl =
    (await getPdfUrl(`course_pdf_${courseId}`)) ||
    (await getPdfUrl(`course_info_${courseId}`)) ||
    (await getPdfUrl(`course_pdf_${slug}`)) ||
    (await getPdfUrl(`course_info_${slug}`))

  const hasPdf = Boolean(coursePdfUrl)
  const viewerUrl = coursePdfUrl || ""

  const buttonLabel = `Por qué cursar nuestro "${courseName}"`

  return (
    <div className="my-[1cm] flex justify-center">
      <Dialog>
        <DialogTrigger className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-secondary-foreground font-bold rounded-md hover:bg-secondary/90 transition-all shadow-lg hover:scale-105 active:scale-95 text-base md:text-lg text-center max-w-full">
          {buttonLabel}
          <MousePointerClick className="w-5 h-5 ml-1 flex-shrink-0 animate-pulse" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-[1050px] w-11/12 bg-white text-slate-800 p-0 overflow-hidden border-none rounded-lg shadow-2xl">
          <DialogHeader className="bg-[#0a4d2e] text-white p-5 flex flex-row items-center justify-between border-b shadow-sm">
            <div>
              <div className="text-yellow-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-0.5">
                Información Completa del Programa
              </div>
              <DialogTitle className="text-lg md:text-xl font-extrabold uppercase text-white line-clamp-1">
                {courseName}
              </DialogTitle>
            </div>
            {hasPdf && (
              <div className="flex items-center gap-2 pr-6">
                <a
                  href={viewerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Abrir en nueva pestaña
                </a>
              </div>
            )}
          </DialogHeader>

          <div className="p-4 bg-slate-100 min-h-[500px] flex flex-col items-center justify-center">
            {hasPdf ? (
              <div className="w-full h-[72vh] rounded-md overflow-hidden bg-white shadow-md border border-slate-200">
                <iframe
                  src={`${viewerUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full border-0"
                  title={`PDF ${courseName}`}
                />
              </div>
            ) : (
              <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-sm border border-slate-200 space-y-3">
                <FileText className="w-16 h-16 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">PDF no disponible aún</h3>
                <p className="text-sm text-slate-600">
                  El documento PDF específico para este curso aún no ha sido adjuntado. Puedes subirlo desde la sección de Configuración o al editar el curso en el panel de administración.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
