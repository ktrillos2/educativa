import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MousePointerClick, ExternalLink, Download, FileText } from "lucide-react"
import { getPdfUrl } from "@/app/actions/pdf-info"

interface ProgramInfoDialogProps {
  type: "diplomados" | "etdh"
}

export async function ProgramInfoDialog({ type }: ProgramInfoDialogProps) {
  const isDiplomado = type === "diplomados"
  const key = isDiplomado ? "info_diplomados_pdf" : "info_etdh_pdf"
  const pdfUrl = await getPdfUrl(key)
  const viewerUrl = `/api/view-pdf?key=${key}`

  const title = isDiplomado
    ? "Información General - Diplomados"
    : "Información General - Programas Académicos ETDH"

  const buttonText = isDiplomado
    ? "¿Por qué cursar nuestros Diplomados?"
    : "¿Por qué cursar nuestros programas ETDH?"

  return (
    <div className="w-full mb-12 flex justify-center">
      <Dialog>
        <DialogTrigger className="flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-md hover:bg-secondary/90 transition-all shadow-xl hover:scale-105 active:scale-95 text-lg">
          {buttonText}
          <MousePointerClick className="w-6 h-6 ml-2 animate-pulse" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-[1050px] w-11/12 bg-white text-slate-800 p-0 overflow-hidden border-none rounded-lg shadow-2xl">
          <DialogHeader className="bg-[#0a4d2e] text-white p-5 flex flex-row items-center justify-between border-b shadow-sm">
            <div>
              <div className="text-yellow-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-0.5">
                Documento Informativo Oficial
              </div>
              <DialogTitle className="text-lg md:text-xl font-extrabold uppercase text-white">
                {title}
              </DialogTitle>
            </div>
            {pdfUrl && (
              <div className="flex items-center gap-2 pr-6">
                <a
                  href={viewerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Abrir en pestaña nueva
                </a>
                <a
                  href={viewerUrl}
                  download={`Informacion-${type}.pdf`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar PDF
                </a>
              </div>
            )}
          </DialogHeader>

          <div className="p-4 bg-slate-100 min-h-[500px] flex flex-col items-center justify-center">
            {pdfUrl ? (
              <div className="w-full h-[72vh] rounded-md overflow-hidden bg-white shadow-md border border-slate-200">
                <iframe
                  src={viewerUrl}
                  className="w-full h-full border-0"
                  title={title}
                />
              </div>
            ) : (
              <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-sm border border-slate-200 space-y-3">
                <FileText className="w-16 h-16 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">PDF no disponible aún</h3>
                <p className="text-sm text-slate-600">
                  El documento PDF de información general aún no ha sido cargado desde la sección de Configuración en el panel de administración.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
