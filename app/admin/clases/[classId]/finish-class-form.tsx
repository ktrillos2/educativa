import { useState } from "react"
import { finishClassWithRecording } from "@/app/actions/class-management"
import { UploadCloud, Loader2, CheckCircle2, Video } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export function FinishClassForm({ classId, courseId }: { classId: string, courseId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setUploadProgress(0)

    try {
      const formData = new FormData(e.currentTarget)
      const file = formData.get("video_file") as File
      
      if (!file || file.size === 0) {
        setError("Por favor selecciona un archivo de video válido.")
        setLoading(false)
        return
      }

      // 1. Upload to Supabase Storage
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${classId}-${Date.now()}.${fileExt}`
      const filePath = `videos/${fileName}`

      // We use standard upload, for huge files resumable upload would be better but this works for most cases
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error("Storage upload error:", uploadError)
        setError("Error al subir el video a Supabase Storage: " + uploadError.message + ". Asegúrate de haber creado el bucket 'recordings' y que sea público.")
        setLoading(false)
        return
      }

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(filePath)

      // 3. Save to database using server action
      const actionFormData = new FormData()
      actionFormData.append("class_id", classId)
      actionFormData.append("course_id", courseId)
      actionFormData.append("file_url", publicUrl)
      
      const result = await finishClassWithRecording(actionFormData)
      
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError("Ocurrió un error inesperado: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center flex flex-col items-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
        <h3 className="font-bold text-lg mb-1">Clase Finalizada y Grabación Guardada</h3>
        <p className="text-sm">Los estudiantes ya pueden ver la grabación en la plataforma.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl border border-[oklch(0.88_0.04_145)] space-y-4">
      <div>
        <h3 className="font-bold text-lg text-[oklch(0.25_0.10_145)] flex items-center gap-2 mb-2">
          <UploadCloud className="w-5 h-5 text-primary" />
          Subir Grabación a Supabase
        </h3>
        <p className="text-sm text-[oklch(0.55_0.04_145)] mb-4">
          Selecciona el archivo de video (MP4, WebM, etc.) de la clase. Se subirá directamente a Supabase Storage y la clase se marcará como finalizada.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-[oklch(0.25_0.10_145)] mb-2">Archivo de Video</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            name="video_file"
            accept="video/*"
            required 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 font-medium">Haz clic o arrastra el video aquí</p>
          <p className="text-xs text-gray-400 mt-1">Formatos soportados: MP4, WebM (Max. recomendado 500MB)</p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Subiendo video a Supabase... (Por favor espera)</>
        ) : (
          "Subir Grabación y Finalizar Clase"
        )}
      </button>
    </form>
  )
}
