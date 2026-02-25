"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function AboutHero() {
  return (
    <section className="relative bg-primary pt-32 pb-24 overflow-hidden flex items-center justify-center min-h-[500px]">
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
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-secondary/30 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
          >
            <span className="text-white text-sm font-bold uppercase tracking-widest mx-2">
              Líderes del Mérito S.A.S.
            </span>
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
            className="w-24 h-1.5 bg-secondary mx-auto mb-8 rounded-full"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/90 leading-relaxed text-pretty font-light max-w-3xl mx-auto"
          >
            Somos una institución educativa de vanguardia comprometida con la excelencia académica y el desarrollo integral de profesionales preparados para liderar el futuro.
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
