'use client'

import { Icon } from '@iconify/react'

export function WhatsAppButton() {
  // Aquí puedes configurar el número de teléfono (con código de país) y el mensaje por defecto.
  const phoneNumber = "573000000000" // Ejemplo: 57 para Colombia + Número
  const message = "Hola, me gustaría obtener más información sobre los programas de la Academia."
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center  bg-[#25D366] text-white shadow-lg shadow-black/20 hover:scale-110 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <Icon icon="mdi:whatsapp" className="w-8 h-8" />
      
      {/* Tooltip lateral */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 w-max scale-0  bg-white px-4 py-2 text-sm font-bold text-[#006838] shadow-lg opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 origin-right border border-gray-100">
        ¿Necesitas ayuda?
      </span>
      
      {/* Efecto de pulso en el fondo para llamar la atención */}
      <span className="absolute inline-flex h-full w-full  bg-[#25D366] opacity-30 animate-ping pointer-events-none" style={{ animationDuration: '3s' }}></span>
    </a>
  )
}
