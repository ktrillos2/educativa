"use client"

import { useState } from "react"
import { deleteTopic, deleteReply } from "@/app/actions/forum"
import { Trash2 } from "lucide-react"

export function DeleteForumAction({ 
    id, 
    type, 
    topicId = null,
    courseId = null 
}: { 
    id: string, 
    type: "TOPIC" | "REPLY",
    topicId?: string | null,
    courseId?: string | null
}) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`¿Estás seguro de eliminar est${type === "TOPIC" ? "e tema" : "a respuesta"}? Esta acción no se puede deshacer.`)) return

        setLoading(true)
        let res
        if (type === "TOPIC") {
            res = await deleteTopic(id, courseId)
        } else {
            res = await deleteReply(id, topicId!, courseId)
        }

        if (!res.success) {
            alert("Error al eliminar: " + res.error)
            setLoading(false)
        }
        // Si tiene éxito, el action hace revalidatePath
    }

    return (
        <button 
            onClick={handleDelete}
            disabled={loading}
            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
            title={`Eliminar ${type === "TOPIC" ? "tema" : "respuesta"}`}
        >
            <Trash2 className="w-3.5 h-3.5" />
        </button>
    )
}
