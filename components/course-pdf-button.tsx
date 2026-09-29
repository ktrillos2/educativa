import { MousePointerClick } from "lucide-react"

interface CoursePdfButtonProps {
  type: "diplomados" | "etdh"
  courseId: string
  courseName: string
}

export function CoursePdfButton({ type, courseId, courseName }: CoursePdfButtonProps) {
  const isDiplomado = type === "diplomados"
  
  // URL determinística basada en el ID del curso y el bucket 'course-covers'
  const pdfUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/course-covers/pdf_info_${courseId}.pdf`

  return (
    <div className="mt-6 flex justify-center">
      <a 
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-md hover:bg-secondary/90 transition-all shadow-xl hover:scale-105 active:scale-95 text-lg text-center"
      >
        ¿Por qué cursar nuestro {courseName}?
        <MousePointerClick className="w-6 h-6 ml-2 animate-pulse" />
      </a>
    </div>
  )
}
