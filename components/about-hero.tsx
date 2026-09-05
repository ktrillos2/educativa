"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function AboutHero() {
  return (
    <section className="relative bg-primary pt-32 pb-[1cm] overflow-hidden min-h-[500px]">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/professional-education-classroom-students-learning.jpg"
          alt="Academia background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-secondary/30  blur-2xl" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-white/10  blur-2xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 bg-white/10 text-white border-l-4 border-secondary text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-8 shadow-[4px_4px_0_0_rgba(197,160,89,0.3)] backdrop-blur-md"
          >
            Líderes del Mérito S.A.S.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 text-balance drop-shadow-lg tracking-tight"
          >
            Quiénes <span className="text-secondary">Somos</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-24 h-1.5 bg-secondary mx-auto mb-8 "
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-white/90 leading-relaxed text-pretty font-light max-w-4xl mx-auto"
          >
            Somos una institución de Educación para el Trabajo y el Desarrollo Humano (ETDH), dedicada a la formación integral y actualización del talento humano mediante programas académicos, cursos, diplomados y simulacros orientados al fortalecimiento de competencias para servidores públicos y entidades de las diferentes ramas del poder público.
          </motion.p>
        </div>
      </div>

      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 120H1440V0C1440 0 1120 120 720 120C320 120 0 0 0 0V120Z" className="fill-background" />
        </svg>
      </div>
    </section>
  )
}
