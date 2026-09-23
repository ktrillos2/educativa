"use client"

import { useRouter } from "next/navigation"

interface AdminCourseSelectProps {
  coursesList: { id: string; title: string }[]
  selectedCourseId: string
  activeScope: string
  query: string
}

export function AdminCourseSelect({ coursesList, selectedCourseId, activeScope, query }: AdminCourseSelectProps) {
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const params = new URLSearchParams()
    if (activeScope) params.set("scope", activeScope)
    if (query) params.set("q", query)
    if (val) params.set("course", val)

    router.push(`/admin/foros?${params.toString()}`)
  }

  return (
    <select
      value={selectedCourseId}
      onChange={handleChange}
      className="px-3 py-2 border border-[oklch(0.88_0.04_145)] rounded-lg text-xs font-medium bg-white focus:outline-none"
    >
      <option value="">Todos los Cursos</option>
      {coursesList.map((c) => (
        <option key={c.id} value={c.id}>
          {c.title}
        </option>
      ))}
    </select>
  )
}
