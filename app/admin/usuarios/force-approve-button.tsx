"use client"

import { useState } from "react"
import { forceApproveStudent } from "@/app/actions/update-enrollment"
import { CheckCircle2, Loader2 } from "lucide-react"

export function ForceApproveButton({ 
    userId, 
    courseId,
    totalModules
}: { 
    userId: string, 
    courseId: string,
    totalModules: number
}) {
    const [loading, setLoading] = useState(false)

    const handleApprove = async () => {
        const confirmed = window.confirm(
            "¿Estás seguro de querer aprobar manualmente el 100% de los módulos para este estudiante? Esta acción no se puede deshacer."
        )
        
        if (!confirmed) return

        setLoading(true)
        const res = await forceApproveStudent(userId, courseId, totalModules)
        if (!res.success) {
            alert("Error al aprobar al estudiante: " + res.error)
        }
        
        setLoading(false)
    }

    return (
        <button 
            onClick={handleApprove}
            disabled={loading}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1 cursor-pointer transition-colors
                bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Aprobar manualmente este curso (100% en todos los módulos)"
        >
            {loading ? (
                <><Loader2 className="w-3 h-3 animate-spin" /> Procesando...</>
            ) : (
                <><CheckCircle2 className="w-3 h-3" /> Aprobar Manualmente ✨</>
            )}
        </button>
    )
}
