"use client"

import { useState } from "react"
import { Download } from "@/components/ui/icons"
import { recordDownload } from "@/app/actions/record-download"

interface DownloadButtonProps {
    courseId: string
    type: "CERTIFICATE" | "ACTA"
    label: string
    className?: string
    iconClassName?: string
}

export function DownloadCertificateButton({ courseId, type, label, className = "", iconClassName = "w-5 h-5" }: DownloadButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        setLoading(true)
        try {
            // Guardar el registro en la base de datos
            await recordDownload(courseId, type)
            // Mostrar el diálogo de impresión/descarga en el navegador
            window.print()
        } catch (error) {
            console.error("Error al registrar descarga:", error)
            // Aún si falla el registro, permitimos que el estudiante descargue
            window.print()
        } finally {
            setLoading(false)
        }
    }

    return (
        <button 
            onClick={handleDownload}
            disabled={loading}
            className={`flex items-center gap-2 transition-all ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            <Download className={iconClassName} />
            {loading ? "Preparando..." : label}
        </button>
    )
}
