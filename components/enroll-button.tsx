"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { enrollAction } from "@/app/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function EnrollButton({ courseId }: { courseId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleEnroll() {
        setLoading(true)
        const result = await enrollAction(courseId)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("¡Inscripción exitosa! Bienvenido al diplomado.")
            router.refresh()
        }
    }

    return (
        <Button 
            size="lg" 
            onClick={handleEnroll} 
            disabled={loading}
            className="w-full sm:w-auto font-bold text-lg bg-secondary hover:bg-secondary/90 text-white"
        >
            {loading ? "Procesando..." : "Inscribirme Ahora"}
        </Button>
    )
}
