"use client"

import { useState, useRef } from "react"
import { uploadIdDocument } from "@/app/actions/upload-document"
import { UploadCloud, CheckCircle, FileText, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

interface UploadDocumentFormProps {
    existingDocumentUrl?: string | null
    children: React.ReactNode // El botón o contenido de descarga del certificado original
}

export function UploadDocumentForm({ existingDocumentUrl, children }: UploadDocumentFormProps) {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [isReuploading, setIsReuploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const hasDocument = !!existingDocumentUrl

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selected = e.target.files[0]
            if (selected.type !== "application/pdf") {
                alert("Por favor, selecciona únicamente un archivo PDF.")
                return
            }
            if (selected.size > 5 * 1024 * 1024) {
                alert("El archivo pesa más de 5MB. Por favor, redúcelo o escanea a menor calidad.")
                return
            }
            setFile(selected)
        }
    }

    const handleUpload = async () => {
        if (!file) return
        
        setLoading(true)
        const formData = new FormData()
        formData.append("file", file)

        const res = await uploadIdDocument(formData)
        
        if (res.success) {
            // El certificado debería aparecer ahora porque la BD ya tiene el link
            setIsReuploading(false)
            setFile(null)
            router.refresh()
        } else {
            alert(res.error || "Ocurrió un error al subir el archivo.")
        }
        
        setLoading(false)
    }

    // Si ya tiene el documento subido y no está forzando re-subida
    if (hasDocument && !isReuploading) {
        return (
            <div className="flex flex-col items-center gap-6 w-full">
                {/* Mostramos el botón original del certificado (children) */}
                <div className="w-full flex justify-center">
                    {children}
                </div>
                
                {/* Tarjeta informando que la cédula está subida */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-lg mt-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                        <div className="text-left">
                            <p className="font-bold text-emerald-800 text-sm">Documento de identidad verificado</p>
                            <a href={existingDocumentUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-0.5">
                                <FileText className="w-3 h-3" /> Ver documento subido
                            </a>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsReuploading(true)}
                        className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                    >
                        <RefreshCw className="w-3 h-3" /> Actualizar
                    </button>
                </div>
            </div>
        )
    }

    // Estado inicial: Formulario para subir la cédula
    return (
        <div className="bg-white border-2 border-dashed border-[oklch(0.88_0.04_145)] rounded-xl p-8 flex flex-col items-center text-center max-w-lg mx-auto w-full">
            <div className="w-16 h-16 bg-[oklch(0.97_0.01_145)] rounded-full flex items-center justify-center mb-4 text-[oklch(0.35_0.10_145)]">
                <UploadCloud className="w-8 h-8" />
            </div>
            
            <h3 className="font-bold text-xl text-[oklch(0.25_0.10_145)] mb-2">Requisito Obligatorio</h3>
            <p className="text-sm text-[oklch(0.55_0.04_145)] mb-6">
                Para garantizar la validez de tu certificado académico y liberar tu diploma, necesitas subir una copia en PDF de tu documento de identidad (Cédula).
            </p>

            <input 
                type="file" 
                accept="application/pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {!file ? (
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[oklch(0.35_0.10_145)] hover:bg-[oklch(0.30_0.10_145)] text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                >
                    Seleccionar Archivo PDF
                </button>
            ) : (
                <div className="w-full flex flex-col gap-4">
                    <div className="bg-[oklch(0.97_0.01_145)] p-3 rounded flex items-center justify-between border border-[oklch(0.90_0.02_145)]">
                        <div className="flex items-center gap-2 text-sm text-[oklch(0.35_0.10_145)] truncate">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate font-medium">{file.name}</span>
                        </div>
                        <button 
                            onClick={() => setFile(null)}
                            className="text-[oklch(0.55_0.04_145)] hover:text-red-500 text-xs font-bold"
                            disabled={loading}
                        >
                            Quitar
                        </button>
                    </div>
                    <button 
                        onClick={handleUpload}
                        disabled={loading}
                        className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Subiendo archivo..." : "Confirmar y Subir Cédula"}
                    </button>
                </div>
            )}

            {isReuploading && (
                <button 
                    onClick={() => { setIsReuploading(false); setFile(null); }}
                    className="mt-4 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                    Cancelar actualización
                </button>
            )}
        </div>
    )
}
