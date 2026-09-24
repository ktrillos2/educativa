'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, ShieldCheck } from '@/components/ui/icons'
import { toast } from 'sonner'

interface CoursePaymentProps {
  courseId: string
  programName: string
  price?: string | number
  compact?: boolean
}

export function CoursePayment({ courseId, programName, price, compact = true }: CoursePaymentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Extraer precio numérico y formateado
  let numericPrice = 350000
  let formattedPrice = "$350.000 COP"

  if (typeof price === 'number' && price > 0) {
    numericPrice = price
    formattedPrice = `$${price.toLocaleString('es-CO')} COP`
  } else if (typeof price === 'string' && price.trim()) {
    const cleanDigits = price.replace(/[^0-9]/g, '')
    if (cleanDigits) {
      const parsed = parseInt(cleanDigits, 10)
      if (!isNaN(parsed) && parsed > 0) {
        numericPrice = parsed
        formattedPrice = price.includes("COP") ? price : `$${parsed.toLocaleString('es-CO')} COP`
      }
    }
  }

  const amountInCents = numericPrice * 100

  const handlePaymentClick = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          programName,
          amount: amountInCents
        })
      })

      const data = await res.json()

      if (!data.success || !data.checkoutUrl) {
        throw new Error(data.error || 'Error al procesar la orden con la pasarela de pagos')
      }

      window.location.href = data.checkoutUrl
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <div className="w-full space-y-3 pt-2">
        <div className="bg-muted/40 p-3.5 border border-border text-center">
          <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Valor del Programa</p>
          <p className="text-2xl font-black text-primary">{formattedPrice}</p>
        </div>

        <button 
          onClick={handlePaymentClick}
          disabled={loading}
          className="w-full bg-secondary text-white py-3 px-4 font-bold text-sm sm:text-base hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0_0_#006838] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#006838]"
        >
          <CreditCard className="w-5 h-5 shrink-0" />
          <span>{loading ? 'Generando Orden...' : 'Pagar y Comenzar'}</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
          <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>Pagos 100% seguros procesados por Openpay BBVA</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm border p-6 md:p-8 text-center max-w-xl mx-auto my-4">
      <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide text-primary">¡Estás a un paso de comenzar!</h2>
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        Para habilitar tu acceso al contenido de <strong>{programName}</strong> y comenzar a cursarlo, debes realizar el pago correspondiente a tu matrícula.
      </p>

      <div className="bg-muted/30 p-4 mb-6 border border-border">
        <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Valor del Programa</p>
        <p className="text-3xl font-black text-foreground">{formattedPrice}</p>
      </div>

      <button 
        onClick={handlePaymentClick}
        disabled={loading}
        className="w-full bg-secondary text-white py-3.5 px-4 font-bold text-sm sm:text-base hover:bg-secondary/90 transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0_0_#006838]"
      >
        <CreditCard className="w-5 h-5 shrink-0" />
        <span>{loading ? 'Generando Orden...' : 'Pagar y Comenzar'}</span>
      </button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        Pagos 100% seguros procesados por Openpay BBVA
      </div>
    </div>
  )
}
