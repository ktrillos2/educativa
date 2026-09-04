"use client"

import { useState } from "react"
import { toggleEnrollmentExpiration } from "@/app/actions/update-enrollment"
import { AlertTriangle, CheckCircle } from "lucide-react"

export function EnrollmentStatusToggle({ 
    enrollmentId, 
    initialStatus 
}: { 
    enrollmentId: string, 
    initialStatus: boolean 
}) {
    const [isExpired, setIsExpired] = useState(initialStatus)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        const newStatus = !isExpired
        const res = await toggleEnrollmentExpiration(enrollmentId, newStatus)
        if (res.success) {
            setIsExpired(newStatus)
        } else {
            alert("Error al actualizar el estado: " + res.error)
        }
        setLoading(false)
    }

    return (
        <button 
            onClick={handleToggle}
            disabled={loading}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1 cursor-pointer transition-colors ${
                isExpired 
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isExpired ? 'El estudiante está marcado como rezagado/expulsado' : 'El estudiante está activo en el cohorte'}
        >
            {isExpired ? (
                <><AlertTriangle className="w-3 h-3" /> Rezagado / Suspendido</>
            ) : (
                <><CheckCircle className="w-3 h-3" /> Cohorte Activo</>
            )}
        </button>
    )
}
