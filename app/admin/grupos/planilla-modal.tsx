"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Printer, Loader2, Heart } from "lucide-react"

interface PlanillaModalProps {
  groupId: string
  groupName: string
}

export function PlanillaModal({ groupId, groupName }: PlanillaModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && !data) {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/admin/export-etdh-planilla?groupId=${groupId}&format=json`)
        if (!res.ok) {
          throw new Error("No se pudo cargar la información de la planilla.")
        }
        const json = await res.json()
        setData(json)
      } catch (err: any) {
        setError(err.message || "Error al cargar la planilla")
      } finally {
        setLoading(false)
      }
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full mt-3 bg-[oklch(0.25_0.10_145)] text-white hover:bg-[oklch(0.35_0.10_145)] hover:text-white border-none font-semibold text-xs py-2 gap-2 shadow-sm cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          Vista Previa y Descargar Planilla
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="px-6 py-4 bg-slate-900 text-white flex-row justify-between items-center space-y-0">
          <div>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Planilla de Estudiantes - ETDH
            </DialogTitle>
            <p className="text-xs text-slate-300 mt-1">
              Cohorte: <span className="font-semibold text-emerald-300">{groupName}</span>
            </p>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <p className="text-sm font-medium">Cargando vista previa de la planilla...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600 bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="font-semibold">{error}</p>
            </div>
          ) : data ? (
            <>
              {/* Barra de Estadísticas y Exportación */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{data.course}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Total estudiantes matriculados: <span className="font-bold text-emerald-700 text-sm">{data.totalStudents}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <a
                    href={`/api/admin/export-etdh-planilla?groupId=${groupId}&format=word`}
                    download
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" /> Descargar Word (.doc)
                  </a>
                  <a
                    href={`/api/admin/export-etdh-planilla?groupId=${groupId}&format=pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                  </a>
                </div>
              </div>

              {/* Vista previa de la tabla */}
              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-semibold">
                      <th className="p-3 text-center border-b border-slate-800 w-10">#</th>
                      <th className="p-3 border-b border-slate-800">Nombre Completo</th>
                      <th className="p-3 border-b border-slate-800">Documento (CC)</th>
                      <th className="p-3 border-b border-slate-800">Correo Electrónico</th>
                      <th className="p-3 border-b border-slate-800">Teléfono</th>
                      <th className="p-3 border-b border-slate-800">Dirección</th>
                      <th className="p-3 border-b border-slate-800">Fecha de Inicio</th>
                      <th className="p-3 border-b border-slate-800">Estado</th>
                      <th className="p-3 text-center border-b border-slate-800">Fecha de Certificación</th>
                      <th className="p-3 text-center border-b border-slate-800">Acta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {data.students && data.students.length > 0 ? (
                      data.students.map((s: any) => (
                        <tr key={s.index} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 text-center font-medium text-slate-500">{s.index}</td>
                          <td className="p-3 font-semibold text-slate-900">{s.name}</td>
                          <td className="p-3 font-mono text-slate-700">{s.document}</td>
                          <td className="p-3 text-slate-600">{s.email}</td>
                          <td className="p-3 text-slate-600">{s.phone}</td>
                          <td className="p-3 text-slate-600">{s.address}</td>
                          <td className="p-3 text-slate-600 font-medium">{s.startDate}</td>
                          <td className="p-3 font-medium">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                              {s.status}
                            </span>
                          </td>
                          <td className="p-3 text-center font-medium">
                            {s.certificationDate !== "No certificado" ? (
                              <span className="text-emerald-700 font-bold">{s.certificationDate}</span>
                            ) : (
                              <span className="text-slate-400">No certificado</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {s.actaDownloaded === "Sí" ? (
                              <span className="text-emerald-700 font-bold">Sí ({s.actaDate})</span>
                            ) : (
                              <span className="text-slate-400">No</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="p-10 text-center text-slate-500 bg-slate-50">
                          No hay estudiantes matriculados en este cohorte todavía.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>

        {/* Branding Footer Obligatorio */}
        <div className="px-6 py-3 bg-slate-900 text-slate-400 text-xs flex justify-between items-center border-t border-slate-800">
          <span>Vista Previa Oficial Planilla ETDH</span>
          <a
            href="https://www.kytcode.lat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <span>Desarrollado por K&T</span>
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
            <span>— {currentYear}</span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
