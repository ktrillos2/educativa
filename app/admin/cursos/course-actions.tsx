"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import { deleteCourse } from "@/app/actions/courses"

export function CourseActions({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.")) {
      setIsDeleting(true)
      await deleteCourse(id)
      setIsDeleting(false)
      // The server action already revalidates paths, but we can router.refresh() to be safe
      router.refresh()
    }
  }

  return (
    <div className="flex gap-2 w-full mt-2">
      <Link
        href={`/admin/cursos/${encodeURIComponent(id)}/editar`}
        className="flex-1 py-2 px-3 bg-white text-primary hover:bg-primary/5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-primary/20 shadow-sm"
      >
        <Pencil className="w-3.5 h-3.5" /> Editar
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex-1 py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-red-200 disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" /> {isDeleting ? "..." : "Eliminar"}
      </button>
    </div>
  )
}
