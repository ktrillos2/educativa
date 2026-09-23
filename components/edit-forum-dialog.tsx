"use client"

import { useState } from "react"
import { Pencil, X, Loader2 } from "lucide-react"
import { updateTopic, updateReply } from "@/app/actions/forum"

interface EditForumDialogProps {
  id: string
  type: "topic" | "reply"
  initialTitle?: string
  initialContent: string
  initialCategory?: string
  topicId?: string // Obligatorio si type === "reply"
  courseId?: string | null
  categories?: string[]
}

export function EditForumDialog({
  id,
  type,
  initialTitle = "",
  initialContent = "",
  initialCategory = "",
  topicId = "",
  courseId = null,
  categories = [],
}: EditForumDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [category, setCategory] = useState(initialCategory)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    let res
    if (type === "topic") {
      res = await updateTopic(id, title, content, category, courseId)
    } else {
      res = await updateReply(id, content, topicId, courseId)
    }

    setLoading(false)

    if (res?.success) {
      setIsOpen(false)
    } else {
      setError(res?.error || "Error al actualizar la publicación")
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
        title={type === "topic" ? "Editar tema" : "Editar respuesta"}
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-150 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">
                {type === "topic" ? "Editar Tema de Foro" : "Editar Respuesta"}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {type === "topic" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Título del Tema
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  {categories.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Categoría
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Contenido
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
