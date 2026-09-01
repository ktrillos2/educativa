"use client"

import { useState, useEffect } from "react"
import { Save, Video, AlertCircle } from "lucide-react"
import { getSettings, saveSettings } from "@/app/actions/settings"

type PromoVideo = {
  url: string;
  title: string;
}

export default function VideosAdminPage() {
  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [videos, setVideos] = useState<PromoVideo[]>([
    { url: "", title: "" },
    { url: "", title: "" },
    { url: "", title: "" },
  ])

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings("promo_videos")
      if (data && Array.isArray(data)) {
        // Aseguramos que siempre haya 3 campos llenando con vacíos si faltan
        const loadedVideos = [...data]
        while (loadedVideos.length < 3) {
          loadedVideos.push({ url: "", title: "" })
        }
        setVideos(loadedVideos.slice(0, 3))
      }
      setIsLoading(false)
    }
    loadSettings()
  }, [])

  const handleVideoChange = (index: number, field: keyof PromoVideo, value: string) => {
    const newVideos = [...videos]
    newVideos[index] = { ...newVideos[index], [field]: value }
    setVideos(newVideos)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    setSuccess(null)
    
    try {
      const result = await saveSettings("promo_videos", videos)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess("Videos actualizados correctamente. Ya son visibles en la página de diplomados.")
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al guardar.")
    } finally {
      setIsPending(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-20 text-[oklch(0.55_0.04_145)]">Cargando configuración...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Videos Promocionales</h1>
        <p className="text-[oklch(0.55_0.04_145)] text-sm">Gestiona los 3 videos motivacionales que aparecen en la página de diplomados.</p>
      </div>

      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        <div className="bg-[oklch(0.30_0.10_145)] px-6 py-5 text-white flex items-center gap-3">
          <Video className="w-6 h-6" />
          <div>
            <h2 className="text-lg font-bold">Configuración de Videos</h2>
            <p className="text-white/70 text-sm">Pega aquí los enlaces directos a tus videos (.mp4, .webm)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="grid gap-8">
            {[0, 1, 2].map((index) => (
              <div key={index} className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-6">
                <div className="bg-gray-200 rounded-lg flex items-center justify-center w-full md:w-48 aspect-video flex-shrink-0 border border-dashed border-gray-300">
                  {videos[index].url ? (
                    <video src={videos[index].url} className="w-full h-full object-cover rounded-lg" controls muted></video>
                  ) : (
                    <div className="text-center p-2 text-gray-400">
                      <Video className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-xs font-medium">Video {index + 1}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
                      URL del Video {index + 1}
                    </label>
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/video.mp4"
                      value={videos[index].url}
                      onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                    <p className="text-xs text-gray-500">Debe ser un enlace directo a un archivo de video (ej: Supabase Storage, S3) o dejar vacío para ocultarlo.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[oklch(0.88_0.04_145)] flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
