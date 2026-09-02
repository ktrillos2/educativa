'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, CreditCard, ShieldCheck, Zap } from '@/components/ui/icons'
import { toast } from 'sonner'
import { simulatePayment } from '@/app/actions/simulate-payment'

interface CoursePaymentProps {
  courseId: string
  programName: string
}

export function CoursePayment({ courseId, programName }: CoursePaymentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const price = 1500000 // 1,500,000 COP
  const amountInCents = 150000000

  const handlePaymentClick = async () => {

    setLoading(true)
    try {
      // 1. Create order
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

      // 2. Redirigir al Checkout de Openpay
      window.location.href = data.checkoutUrl

    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  const handleDevPayment = async () => {
    setLoading(true)
    try {
      const res = await simulatePayment(courseId)
      if (!res.success) throw new Error(res.error)
      toast.success('Pago simulado con éxito (Modo Dev)')
      // Forzar una recarga dura del navegador para limpiar cualquier caché de Next.js
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-sm border p-8 md:p-12 text-center max-w-2xl mx-auto my-8">

      <div className="w-20 h-20 bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-6">
        <BookOpen className="w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4 uppercase tracking-wide text-primary">¡Estás a un paso de comenzar!</h2>
      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
        Para habilitar tu acceso al contenido de <strong>{programName}</strong> y comenzar a cursarlo, debes realizar el pago correspondiente a tu matrícula. Al finalizar, tu certificado oficial ya estará cubierto por este pago.
      </p>

      <div className="bg-muted/30 p-6 mb-8 border border-border">
        <p className="text-sm text-muted-foreground mb-2 uppercase font-bold tracking-wider">Valor del Programa</p>
        <p className="text-4xl font-black text-foreground">${price.toLocaleString('es-CO')} COP</p>
      </div>

      <button 
        onClick={handlePaymentClick}
        disabled={loading}
        className="w-full bg-secondary text-white py-4 font-bold text-lg hover:bg-secondary/90 transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0_0_#006838]"
      >
        <CreditCard className="w-6 h-6" />
        {loading ? 'Generando Orden...' : 'Pagar y Comenzar'}
      </button>

      <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        Pagos 100% seguros procesados por Openpay BBVA
      </div>

      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={handleDevPayment}
          disabled={loading}
          className="w-full mt-6 bg-purple-600 text-white py-3 font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 rounded-md shadow-sm"
        >
          <Zap className="w-5 h-5" />
          Simular Pago (Modo Desarrollo)
        </button>
      )}
    </div>
  )
}
