import { AlertCircle, Clock } from "@/components/ui/icons"
import Link from "next/link"

interface GroupWaitingProps {
    courseId: string
    courseTitle: string
    minStudents: number
    enrolledCount: number
}

// minStudents y enrolledCount se mantienen en la interfaz por compatibilidad,
// pero NO se muestran al estudiante: el conteo de inscritos es información exclusiva del admin.
export function GroupWaiting({ courseId, courseTitle }: GroupWaitingProps) {
    return (
        <div className="max-w-2xl mx-auto my-16 bg-white border border-amber-200 shadow-lg p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6 rounded-full shadow-inner">
                <Clock className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Grupo en Formación</h2>
            
            <p className="text-lg text-slate-600 mb-8">
                El material de estudio y las evaluaciones del programa <strong>{courseTitle}</strong> estarán disponibles muy pronto.
            </p>

            <div className="bg-amber-50 p-6 border border-amber-100 mb-8 text-left">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                        Tu cupo está reservado. Te notificaremos por correo electrónico en cuanto el material esté habilitado.
                    </span>
                </p>
            </div>

            <Link 
                href={`/diplomados/${courseId}`}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
            >
                Volver a la página del diplomado
            </Link>
        </div>
    )
}
