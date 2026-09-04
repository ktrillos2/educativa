"use client"

import { useState } from "react"
import { createReply } from "@/app/actions/forum"
import { Send } from "lucide-react"

export function CreateReplyForm({ topicId, courseId = null }: { topicId: string, courseId?: string | null }) {
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setLoading(true)
        const res = await createReply(topicId, content, courseId)
        if (res.success) {
            setContent("")
        } else {
            alert("Error al enviar la respuesta: " + res.error)
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-[oklch(0.88_0.04_145)] rounded-xl p-5 shadow-sm mt-6">
            <h4 className="font-bold text-[oklch(0.25_0.10_145)] mb-3 text-sm">Añadir una respuesta</h4>
            <div className="flex flex-col gap-3">
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-[oklch(0.88_0.04_145)] rounded-lg text-sm focus:outline-none focus:border-[oklch(0.35_0.10_145)] min-h-[80px] resize-y"
                    placeholder="Escribe tu respuesta de forma respetuosa..."
                    required
                />
                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        className="px-4 py-2 text-xs font-bold bg-[oklch(0.35_0.10_145)] text-white hover:bg-[oklch(0.30_0.10_145)] rounded-lg transition-colors flex items-center gap-1.5"
                        disabled={loading || !content.trim()}
                    >
                        <Send className="w-3.5 h-3.5" />
                        {loading ? "Enviando..." : "Responder"}
                    </button>
                </div>
            </div>
        </form>
    )
}
