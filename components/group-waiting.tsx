import { Users, AlertCircle, Clock } from "@/components/ui/icons"
import Link from "next/link"

interface GroupWaitingProps {
    courseId: string
    courseTitle: string
    minStudents: number
    enrolledCount: number
}

export function GroupWaiting({ courseId, courseTitle, minStudents, enrolledCount }: GroupWaitingProps) {
    const spotsNeeded = Math.max(0, minStudents - enrolledCount)
    const progressPercent = Math.min(100, Math.round((enrolledCount / minStudents) * 100))

    return (
        <div className="max-w-2xl mx-auto my-16 bg-white border border-amber-200 shadow-lg p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6 rounded-full shadow-inner">
                <Clock className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Grupo en Formación</h2>
            
            <p className="text-lg text-slate-600 mb-8">
                El diplomado <strong>{courseTitle}</strong> aún está reuniendo el cupo mínimo para iniciar. 
                El material de estudio y las evaluaciones estarán disponibles una vez que el grupo esté completo.
            </p>

            <div className="bg-amber-50 p-6 border border-amber-100 mb-8 text-left">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-700" />
                        <span className="font-bold text-amber-900">Estado del grupo</span>
                    </div>
                    <span className="font-bold text-amber-700">
                        {enrolledCount} / {minStudents} estudiantes
                    </span>
                </div>

                <div className="w-full bg-white rounded-full h-3 mb-3 overflow-hidden border border-amber-200">
                    <div
                        className="h-3 rounded-full bg-amber-500 transition-all duration-700"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                
                <p className="text-sm text-amber-800 flex items-start gap-2 mt-4">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                        Faltan <strong>{spotsNeeded} {spotsNeeded === 1 ? 'estudiante' : 'estudiantes'}</strong> para iniciar. 
                        Te notificaremos por correo electrónico en cuanto el grupo esté completo y el material habilitado.
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
