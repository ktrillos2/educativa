"use client"

import { useState, useEffect, useRef } from "react"
import { Save, Video, Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { getSettings, saveSettings } from "@/app/actions/settings"

const MAX_SIZE_MB = 50
const ALLOWED_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov"]
const ALLOWED_MIME = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]

type VideoSlot = {
  url: string
  title: string
}

type UploadState = "idle" | "uploading" | "done" | "error"

function VideoUploader({
  index,
  slot,
  onUploaded,
}: {
  index: number
  slot: VideoSlot
  onUploaded: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string>(slot.url)

  // Sincronizar si la URL cambia desde fuera (ej: carga inicial)
  useEffect(() => {
    setPreview(slot.url)
  }, [slot.url])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Validar tipo
    if (!ALLOWED_MIME.includes(file.type)) {
      setUploadError(`Formato no permitido. Usa ${ALLOWED_EXTENSIONS.join(", ")}.`)
      e.target.value = ""
      return
    }

    // Validar peso
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`El archivo supera el límite de ${MAX_SIZE_MB} MB.`)
      e.target.value = ""
      return
    }

    uploadFile(file)
    e.target.value = ""
  }

  async function uploadFile(file: File) {
    setUploadState("uploading")
    setProgress(0)

    // Simulamos progreso visual mientras sube
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 90))
    }, 300)

    try {
      const form = new FormData()
      form.append("file", file)
      form.append("slot", String(index))

      const res = await fetch("/api/upload-video", { method: "POST", body: form })
      const data = await res.json()

      clearInterval(interval)

      if (!res.ok || data.error) {
        setUploadState("error")
        setUploadError(data.error ?? "Error al subir el video.")
        return
      }

      setProgress(100)
      setPreview(data.url)
      onUploaded(data.url)
      setUploadState("done")
    } catch (err: any) {
      clearInterval(interval)
      setUploadState("error")
      setUploadError("Error de red. Intenta de nuevo.")
    }
  }

  function handleRemove() {
    setPreview("")
    onUploaded("")
    setUploadState("idle")
    setUploadError(null)
    setProgress(0)
  }

  return (
    <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
      {/* Encabezado del slot */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[oklch(0.25_0.10_145)]">
          Video {index + 1}
        </span>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Quitar video
          </button>
        )}
      </div>

      {/* Previsualización */}
      {preview ? (
        <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
          <video
            src={preview}
            className="w-full h-full object-contain"
            controls
            muted
            playsInline
          />
        </div>
      ) : (
        /* Zona de carga */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadState === "uploading"}
          className="w-full border-2 border-dashed border-[oklch(0.75_0.08_145)] rounded-xl p-8 flex flex-col items-center gap-3 text-center hover:border-[oklch(0.45_0.12_145)] hover:bg-[oklch(0.97_0.02_145)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploadState === "uploading" ? (
            <Loader2 className="w-9 h-9 text-[oklch(0.45_0.12_145)] animate-spin" />
          ) : (
            <Upload className="w-9 h-9 text-[oklch(0.55_0.08_145)]" />
          )}
          <div>
            <p className="text-sm font-semibold text-[oklch(0.35_0.10_145)]">
              {uploadState === "uploading" ? "Subiendo..." : "Toca aquí para seleccionar el video"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              MP4, WebM, MOV — máx. {MAX_SIZE_MB} MB
            </p>
          </div>
        </button>
      )}

      {/* Barra de progreso */}
      {uploadState === "uploading" && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-1.5 bg-[oklch(0.45_0.12_145)] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-right">{progress}%</p>
        </div>
      )}

      {/* Confirmación */}
      {uploadState === "done" && (
        <p className="text-xs text-green-700 flex items-center gap-1.5 font-medium">
          <CheckCircle className="w-4 h-4" /> Video subido correctamente. Guarda los cambios para publicarlo.
        </p>
      )}

      {/* Error de validación o subida */}
      {uploadError && (
        <p className="text-xs text-red-600 flex items-start gap-1.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {uploadError}
        </p>
      )}

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.ogg,.mov"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default function VideosAdminPage() {
  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [videos, setVideos] = useState<VideoSlot[]>([
    { url: "", title: "" },
    { url: "", title: "" },
    { url: "", title: "" },
  ])

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings("promo_videos")
      if (data && Array.isArray(data)) {
        const loaded = [...data]
        while (loaded.length < 3) loaded.push({ url: "", title: "" })
        setVideos(loaded.slice(0, 3))
      }
      setIsLoading(false)
    }
    loadSettings()
  }, [])

  function handleUploaded(index: number, url: string) {
    setVideos((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], url }
      return next
    })
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
        setSuccess("¡Videos actualizados! Ya son visibles en la página de diplomados.")
      }
    } catch {
      setError("Ocurrió un error inesperado al guardar.")
    } finally {
      setIsPending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-[oklch(0.55_0.04_145)] gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Cargando configuración...
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl pt-6">
      <div>
        <h1 className="text-2xl font-bold text-[oklch(0.25_0.10_145)]">Videos Promocionales</h1>
        <p className="text-[oklch(0.55_0.04_145)] text-sm mt-1">
          Sube los 3 videos motivacionales que aparecen en la página de diplomados.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[oklch(0.88_0.04_145)] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[oklch(0.30_0.10_145)] px-6 py-5 text-white flex items-center gap-3">
          <Video className="w-6 h-6 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold">Subir Videos</h2>
            <p className="text-white/70 text-sm">Selecciona un archivo de tu dispositivo para cada espacio</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Los 3 slots de video */}
          <div className="grid gap-5">
            {[0, 1, 2].map((i) => (
              <VideoUploader
                key={i}
                index={i}
                slot={videos[i]}
                onUploaded={(url) => handleUploaded(i, url)}
              />
            ))}
          </div>

          <div className="pt-4 border-t border-[oklch(0.88_0.04_145)] flex justify-end">
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
