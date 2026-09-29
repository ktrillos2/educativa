"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function EnrollButton({ 
    courseId, 
    programName, 
    price 
}: { 
    courseId: string; 
    programName?: string; 
    price?: string | number 
}) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleEnroll() {
        setLoading(true)
        try {
            let numericPrice = 350000
            if (typeof price === 'number' && price > 0) {
                numericPrice = price
            } else if (typeof price === 'string' && price.trim()) {
                const cleanDigits = price.replace(/[^0-9]/g, '')
                if (cleanDigits) {
                    const parsed = parseInt(cleanDigits, 10)
                    if (!isNaN(parsed) && parsed > 0) {
                        numericPrice = parsed
                    }
                }
            }

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId,
                    programName: programName || "Programa Académico",
                    amount: numericPrice
                })
            })

            const data = await res.json()

            if (!data.success || !data.checkoutUrl) {
                throw new Error(data.error || 'Error al iniciar la pasarela de pagos')
            }

            toast.loading("Redirigiendo a la pasarela de pagos...")
            window.location.href = data.checkoutUrl
        } catch (err: any) {
            toast.error(err.message || "Error al procesar el pago")
            setLoading(false)
        }
    }

    return (
        <Button 
            size="lg" 
            onClick={handleEnroll} 
            disabled={loading}
            className="w-full sm:w-auto font-bold text-lg bg-secondary hover:bg-secondary/90 text-white shadow-[3px_3px_0_0_#006838]"
        >
            {loading ? "Redirigiendo al pago..." : "Inscribirme y Pagar Ahora"}
        </Button>
    )
}
