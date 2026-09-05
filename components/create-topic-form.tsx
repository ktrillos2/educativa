"use client"

import { useState } from "react"
import { createTopic } from "@/app/actions/forum"
import { MessageSquarePlus } from "lucide-react"

export function CreateTopicForm({ courseId = null }: { courseId?: string | null }) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("General")
    const [loading, setLoading] = useState(false)

    const socialCategories = ["General", "Recursos de Estudio", "Noticias de la Academia", "Dudas Administrativas", "Grupos de Estudio"]
    const academicCategories = ["Dudas Generales", "Problemas Técnicos", "Sobre Evaluaciones"]
    const categories = courseId ? academicCategories : socialCategories

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) return

        setLoading(true)
        const res = await createTopic(title, content, category, courseId)
        if (res.success) {
            setTitle("")
            setContent("")
            setIsOpen(false)
        } else {
            alert("Error al crear el tema: " + res.error)
        }
        setLoading(false)
    }

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="bg-[oklch(0.35_0.10_145)] hover:bg-[oklch(0.30_0.10_145)] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-sm"
            >
                <MessageSquarePlus className="w-4 h-4" />
                Nuevo Tema
            </button>
        )
    }

    return (
        <div className="bg-white border border-[oklch(0.88_0.04_145)] rounded-xl p-5 mb-6 shadow-sm animate-fade-in">
            <h3 className="font-bold text-[oklch(0.25_0.10_145)] mb-4">Crear un nuevo tema de discusión</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-[oklch(0.40_0.08_145)] mb-1">Título del Tema</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-[oklch(0.88_0.04_145)] rounded-lg text-sm focus:outline-none focus:border-[oklch(0.35_0.10_145)]"
                        placeholder="Ej. ¿Cómo instalo el programa para la clase 1?"
                        required
                        maxLength={100}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-[oklch(0.40_0.08_145)] mb-1">Categoría</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-[oklch(0.88_0.04_145)] rounded-lg text-sm focus:outline-none focus:border-[oklch(0.35_0.10_145)] bg-white"
                        required
                    >
                        <option value="" disabled>Selecciona una categoría...</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-[oklch(0.40_0.08_145)] mb-1">Tu Pregunta o Mensaje</label>
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 border border-[oklch(0.88_0.04_145)] rounded-lg text-sm focus:outline-none focus:border-[oklch(0.35_0.10_145)] min-h-[100px] resize-y"
                        placeholder="Escribe tu mensaje aquí..."
                        required
                    />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                    <button 
                        type="button" 
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-sm font-bold text-[oklch(0.40_0.08_145)] hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="px-4 py-2 text-sm font-bold bg-[oklch(0.35_0.10_145)] text-white hover:bg-[oklch(0.30_0.10_145)] rounded-lg transition-colors flex items-center gap-2"
                        disabled={loading || !title.trim() || !content.trim()}
                    >
                        {loading ? "Publicando..." : "Publicar Tema"}
                    </button>
                </div>
            </form>
        </div>
    )
}
