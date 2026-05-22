"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, ArrowRight, Clock, Star, Users } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

// Mock data as long as there is no specific table/data structure requested
const formacionData = [
    {
        id: "f1",
        title: "Técnico en Asistencia Administrativa",
        category: "Administración",
        duration: "18 meses",
        students: "100+",
        rating: 4.8,
        image: "/images/bg1.png",
        description: "Desarrolla habilidades clave para la gestión de recursos, atención al cliente y procesos administrativos empresariales.",
    },
    {
        id: "f2",
        title: "Técnico en Desarrollo de Software",
        category: "Tecnología",
        duration: "24 meses",
        students: "300+",
        rating: 4.9,
        image: "/images/bg2.png",
        description: "Aprende las tecnologías más demandadas por el mercado y conviértete en un desarrollador preparado para la industria actual.",
    },
    {
        id: "f3",
        title: "Técnico en Atención a la Primera Infancia",
        category: "Educación",
        duration: "18 meses",
        students: "150+",
        rating: 4.7,
        image: "/images/bg3.png",
        description: "Fórmate para cuidar, guiar y apoyar el desarrollo integral de niños en sus primeros años de vida de forma responsable.",
    }
]

const categories = ["Todos", "Administración", "Tecnología", "Educación", "Salud"]

export function FormacionAcademicaList() {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeCategory, setActiveCategory] = useState("Todos")

    const filteredPrograms = formacionData.filter(program =>
        (activeCategory === "Todos" || program.category === activeCategory) &&
        (program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <section className="py-16 bg-muted/20 min-h-[600px]">
            <div className="container mx-auto px-4">

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex w-full md:w-auto overflow-x-auto pb-2 md:pb-0 gap-2 hide-scrollbar">
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                variant={activeCategory === cat ? "default" : "outline"}
                                onClick={() => setActiveCategory(cat)}
                                className="rounded-none whitespace-nowrap transition-transform duration-200 hover:scale-105"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Buscar programas..."
                            className="pl-9 pr-10 rounded-none border-muted-foreground/20 focus-visible:ring-primary/20 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent text-muted-foreground">
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* List */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredPrograms.length > 0 ? (
                            filteredPrograms.map(program => (
                                <motion.div
                                    key={program.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-none overflow-hidden shadow-sm border border-border hover:shadow-[8px_8px_0_0_#C5A059] transition-all duration-300 group flex flex-col h-full"
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
                                        <Image
                                            src={program.image}
                                            alt={program.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-none shadow-sm">
                                                {program.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {program.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                                            {program.description}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 pt-4 border-t border-border">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-secondary" />
                                                <span>{program.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4 text-secondary" />
                                                <span>{program.students}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span>{program.rating}</span>
                                            </div>
                                        </div>

                                        <Button asChild className="w-full rounded-none group/btn overflow-hidden relative shadow-[4px_4px_0_0_#C5A059]">
                                            {/* Using href="#" temporarily since individual dynamic pages for formacion-academica aren't created yet */}
                                            <Link href={`#`} className="flex items-center justify-center">
                                                <span className="relative z-10 font-semibold">Ver Detalles</span>
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                                                <div className="absolute inset-0 bg-primary/10 scale-x-0 origin-left group-hover/btn:scale-x-100 transition-transform duration-300 ease-out" />
                                            </Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-20 text-center"
                            >
                                <div className="inline-flex w-20 h-20 items-center justify-center bg-muted rounded-none mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">No se encontraron resultados</h3>
                                <p className="text-muted-foreground">Intenta ajustar tus filtros de búsqueda.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    )
}
