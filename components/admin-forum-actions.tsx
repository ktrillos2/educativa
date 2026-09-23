"use client"

import { useState } from "react"
import { Pin, CheckCircle2, Trash2, Globe, BookOpen } from "lucide-react"
import { togglePinTopic, toggleResolveTopic, deleteTopic } from "@/app/actions/forum"
import { useRouter } from "next/navigation"

import { EditForumDialog } from "@/components/edit-forum-dialog"

interface AdminForumActionsProps {
    topicId: string
    isPinned: boolean
    isResolved?: boolean
    courseId?: string | null
    initialTitle?: string
    initialContent?: string
    initialCategory?: string
}

export function AdminForumActions({ 
    topicId, 
    isPinned, 
    isResolved = false, 
    courseId = null,
    initialTitle = "",
    initialContent = "",
    initialCategory = ""
}: AdminForumActionsProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handlePin = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setLoading(true)
        const res = await togglePinTopic(topicId, isPinned, courseId)
        setLoading(false)
        if (res.success) {
            router.refresh()
        } else {
            alert("Error: " + res.error)
        }
    }

    const handleResolve = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!courseId) return
        setLoading(true)
        const res = await toggleResolveTopic(topicId, isResolved, courseId)
        setLoading(false)
        if (res.success) {
            router.refresh()
        } else {
            alert("Error: " + res.error)
        }
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!confirm("¿Estás seguro de que deseas eliminar este tema y todas sus respuestas?")) return

        setLoading(true)
        const res = await deleteTopic(topicId, courseId)
        setLoading(false)
        if (res.success) {
            router.refresh()
        } else {
            alert("Error al eliminar: " + res.error)
        }
    }

    return (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={handlePin}
                disabled={loading}
                title={isPinned ? "Desfijar tema" : "Fijar tema arriba"}
                className={`p-1.5 rounded text-xs font-medium transition-colors ${
                    isPinned ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
                <Pin className="w-3.5 h-3.5" />
            </button>

            {courseId && (
                <button
                    onClick={handleResolve}
                    disabled={loading}
                    title={isResolved ? "Marcar como pendiente" : "Marcar como resuelto"}
                    className={`p-1.5 rounded text-xs font-medium transition-colors ${
                        isResolved ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
            )}

            {initialContent && (
                <EditForumDialog
                    id={topicId}
                    type="topic"
                    initialTitle={initialTitle}
                    initialContent={initialContent}
                    initialCategory={initialCategory}
                    courseId={courseId}
                />
            )}

            <button
                onClick={handleDelete}
                disabled={loading}
                title="Eliminar tema"
                className="p-1.5 rounded text-xs font-medium bg-gray-100 text-red-600 hover:bg-red-50 transition-colors"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}
