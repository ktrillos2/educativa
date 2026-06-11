'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { Award, CreditCard, ShieldCheck } from '@/components/ui/icons'
import { toast } from 'sonner'

interface CertificatePaymentProps {
  courseId: string
  programName: string
}

export function CertificatePayment({ courseId, programName }: CertificatePaymentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [wompiLoaded, setWompiLoaded] = useState(false)

  const price = 1500000 // 1,500,000 COP
  const amountInCents = 150000000

  const handlePaymentClick = async () => {
    if (!wompiLoaded) {
      toast.error('La pasarela de pagos aún se está cargando. Intenta de nuevo.')
      return
    }

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

      if (!data.success) {
        throw new Error(data.error || 'Error al procesar la orden')
      }

      // 2. Open Wompi Widget
      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents,
        reference: data.reference,
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUB_KEY || 'pub_test_dummy',
      })

      checkout.open(async (result: any) => {
        const transaction = result.transaction
        if (transaction.status === 'APPROVED') {
          // Solo en desarrollo: Simulamos el webhook porque Wompi no puede enviar peticiones a localhost
          if (process.env.NODE_ENV === 'development') {
            try {
              await fetch('/api/webhooks/wompi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  data: {
                    transaction: {
                      id: transaction.id,
                      status: transaction.status,
                      reference: transaction.reference
                    }
                  }
                })
              })
            } catch (e) {
              console.error('Error simulando webhook local', e)
            }
          }

          toast.success('¡Pago aprobado! Desbloqueando certificado...')
          // El webhook actualizará la DB. Hacemos refresh para que el componente de servidor lea payment_verified = true
          router.refresh()
        } else {
          toast.error(`Pago no aprobado. Estado: ${transaction.status}`)
        }
        setLoading(false)
      })

    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-sm border p-8 md:p-12 text-center max-w-2xl mx-auto">
      <Script 
        src="https://checkout.wompi.co/widget.js" 
        strategy="lazyOnload"
        onLoad={() => setWompiLoaded(true)}
      />

      <div className="w-20 h-20 bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-6">
        <Award className="w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4 uppercase tracking-wide text-primary">¡Felicidades por aprobar!</h2>
      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
        Has completado todos los requisitos académicos del programa <strong>{programName}</strong>. 
        Para emitir tu Certificado Oficial y tu Acta Académica con firmas y registro verificable, debes realizar el pago correspondiente.
      </p>

      <div className="bg-muted/30 p-6 mb-8 border border-border">
        <p className="text-sm text-muted-foreground mb-2 uppercase font-bold tracking-wider">Valor del Certificado</p>
        <p className="text-4xl font-black text-foreground">${price.toLocaleString('es-CO')} COP</p>
      </div>

      <button 
        onClick={handlePaymentClick}
        disabled={loading}
        className="w-full bg-secondary text-white py-4 font-bold text-lg hover:bg-secondary/90 transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0_0_#006838]"
      >
        <CreditCard className="w-6 h-6" />
        {loading ? 'Generando Orden...' : 'Pagar y Desbloquear Certificado'}
      </button>

      <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        Pagos 100% seguros procesados por Wompi Bancolombia
      </div>
    </div>
  )
}
