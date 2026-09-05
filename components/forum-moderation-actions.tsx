"use client"

import { useState } from "react"
import { togglePinTopic, toggleResolveTopic } from "@/app/actions/forum"
import { Pin, PinOff, CheckCircle2 } from "lucide-react"

export function ForumModerationActions({ 
    topicId, 
    courseId = null,
    isPinned,
    isResolved,
    isAdmin,
    isAuthor
}: { 
    topicId: string, 
    courseId?: string | null,
    isPinned: boolean,
    isResolved: boolean,
    isAdmin: boolean,
    isAuthor: boolean
}) {
    const [loadingPin, setLoadingPin] = useState(false)
    const [loadingResolve, setLoadingResolve] = useState(false)

    const handlePin = async () => {
        if (!isAdmin) return
        setLoadingPin(true)
        const res = await togglePinTopic(topicId, isPinned, courseId)
        if (!res.success) alert("Error: " + res.error)
        setLoadingPin(false)
    }

    const handleResolve = async () => {
        if (!isAdmin && !isAuthor) return
        setLoadingResolve(true)
        const res = await toggleResolveTopic(topicId, isResolved, courseId!)
        if (!res.success) alert("Error: " + res.error)
        setLoadingResolve(false)
    }

    return (
        <div className="flex gap-2">
            {/* Solo admins pueden fijar */}
            {isAdmin && (
                <button 
                    onClick={handlePin}
                    disabled={loadingPin}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                        isPinned 
                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                >
                    {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    {isPinned ? "Desfijar" : "Fijar Tema"}
                </button>
            )}

            {/* Admins o dueños pueden marcar como resuelto (Solo si es foro académico - curso existe) */}
            {courseId && (isAdmin || isAuthor) && (
                <button 
                    onClick={handleResolve}
                    disabled={loadingResolve}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                        isResolved 
                            ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100' 
                            : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    }`}
                >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isResolved ? "Quitar Resuelto" : "Marcar Resuelto"}
                </button>
            )}
        </div>
    )
}
