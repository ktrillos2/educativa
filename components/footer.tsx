"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, ArrowUpRight, Send } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

export function Footer() {
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation()
  const pathname = usePathname()
  return (
    <footer id="contacto" className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-[1cm]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-6">
              <Image
                src="/images/image.png"
                alt="Academia de Formación Líderes del Mérito"
                width={80}
                height={80}
                className="h-20 w-auto"
              />
            </div>
            <p className="text-background/70 mb-6 text-sm leading-relaxed">
              Formando líderes y profesionales de excelencia desde hace más de 10 años.
            </p>
            <div className="flex gap-2">
              {["facebook", "instagram", "linkedin", "youtube"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="p-2.5 bg-background/10 hover:bg-secondary hover:text-secondary-foreground transition-all "
                  aria-label={social}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    {social === "facebook" && (
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    )}
                    {social === "instagram" && (
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                    )}
                    {social === "linkedin" && (
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    )}
                    {social === "youtube" && (
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    )}
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-secondary" />
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              {["Inicio", "Nosotros", "Diplomados", "Cursos Cortos", "Certificaciones", "Blog"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-background/70 hover:text-secondary transition-colors text-sm inline-flex items-center gap-1.5 group"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-secondary" />
              Programas Populares
            </h3>
            <ul className="space-y-3">
              {[
                "Gestión Empresarial",
                "Seguridad y Salud en el Trabajo",
                "Contratación Estatal",
                "Gestión del Talento Humano",
                "Marketing Digital",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-background/70 hover:text-secondary transition-colors text-sm inline-flex items-center gap-1.5 group"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-secondary" />
              Contacto
            </h3>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: "Calle 10 # 5-30, Centro\nBogotá, Colombia" },
                { icon: Phone, text: "+57 (1) 234 5678" },
                { icon: Mail, text: "info@lideresdelmerito.edu.co" },
                { icon: Clock, text: "Lun - Vie: 8:00 AM - 6:00 PM" },
              ].map(({ icon: Icon, text }, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <div className="p-2 bg-secondary/20 group-hover:bg-secondary transition-colors ">
                    <Icon className="h-4 w-4 text-secondary group-hover:text-secondary-foreground transition-colors shrink-0" />
                  </div>
                  <span className="text-background/70 text-sm whitespace-pre-line">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/60">
            <p className="text-center md:text-left leading-relaxed">© {new Date().getFullYear()} Academia de Formación Líderes del Mérito S.A.S. Todos los derechos reservados.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center">
              <Link 
                href="https://www.kytcode.lat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors font-medium flex items-center justify-center gap-1"
              >
                Desarrollado por K&T <span className="text-white">❤</span>
              </Link>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="#" className="hover:text-secondary transition-colors whitespace-nowrap">
                  Política de Privacidad
                </Link>
                <Link href="#" className="hover:text-secondary transition-colors whitespace-nowrap">
                  Términos y Condiciones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
