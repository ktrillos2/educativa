"use client"

import { useState, useRef } from "react"
import { Upload, X, Link as LinkIcon, CheckCircle } from "lucide-react"

interface ImageUploadZoneProps {
  onImageChange?: (file: File | null, url: string) => void
  defaultUrl?: string
}

export function ImageUploadZone({ onImageChange, defaultUrl = "" }: ImageUploadZoneProps) {
  const [mode, setMode] = useState<"file" | "url">("file")
  const [previewUrl, setPreviewUrl] = useState<string>(defaultUrl)
  const [imageUrl, setImageUrl] = useState<string>(defaultUrl)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Central handler: receives a File object, generates a preview,
   * and — critically — assigns the file to the real <input type="file">
   * via the DataTransfer API so that FormData picks it up on submit.
   */
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido (.png, .jpg, .webp)")
      return
    }

    // Assign the file to the real input so FormData includes it
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInputRef.current.files = dataTransfer.files
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setSelectedFileName(file.name)
    setImageUrl("") // clear URL mode value
    if (onImageChange) {
      onImageChange(file, "")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setSelectedFileName(file.name)
      setImageUrl("")
      if (onImageChange) {
        onImageChange(file, "")
      }
    }
  }

  const handleUrlInputChange = (url: string) => {
    setImageUrl(url)
    setPreviewUrl(url)
    setSelectedFileName(null)
    // Clear any file in the real input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onImageChange) {
      onImageChange(null, url)
    }
  }

  const handleClear = () => {
    setPreviewUrl("")
    setImageUrl("")
    setSelectedFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onImageChange) {
      onImageChange(null, "")
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-sm font-bold text-[oklch(0.25_0.10_145)]">
            Imagen de Portada del Curso *
          </label>
          <p className="text-xs text-[oklch(0.55_0.04_145)] mt-0.5">
            Tamaño recomendado: <strong>1280 × 720 px</strong> (relación 16:9) · Máx 5 MB · PNG, JPG o WebP
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === "file" ? "bg-white text-primary shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Subir archivo / Arrastrar
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === "url" ? "bg-white text-primary shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            URL Externa
          </button>
        </div>
      </div>

      {/*
        Real file input — stays in the DOM so FormData captures the file on submit.
        When user uses drag & drop, we assign the file via DataTransfer API above.
      */}
      <input
        type="file"
        ref={fileInputRef}
        name="image_file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />
      {/* Hidden field for URL mode */}
      <input type="hidden" name="image" value={imageUrl} />

      {previewUrl ? (
        /* Preview View */
        <div className="relative rounded-xl border border-[oklch(0.88_0.04_145)] overflow-hidden bg-gray-50 group shadow-sm">
          <div className="h-48 w-full overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Vista previa de la portada del curso" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white/90 text-primary hover:bg-white rounded-lg text-xs font-bold transition-colors shadow"
              >
                Cambiar Imagen
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors shadow"
                title="Eliminar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-3 bg-white border-t flex justify-between items-center text-xs">
            <span className="font-semibold text-green-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {selectedFileName ? `Archivo: ${selectedFileName}` : "Imagen configurada por URL"}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-500 hover:underline font-bold"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : mode === "file" ? (
        /* Drag & Drop Box */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-primary bg-primary/10 scale-[1.01]"
              : "border-[oklch(0.88_0.04_145)] bg-[oklch(0.99_0.005_145)] hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[oklch(0.25_0.10_145)]">
              Arrastra y suelta tu imagen aquí
            </p>
            <p className="text-xs text-[oklch(0.55_0.04_145)] mt-1">
              o haz clic para explorar · 1280×720 px recomendado · Máx 5 MB
            </p>
          </div>
          <span className="px-4 py-1.5 bg-white border border-[oklch(0.88_0.04_145)] text-primary rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50">
            Examinar archivos...
          </span>
        </div>
      ) : (
        /* URL Input Fallback */
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => handleUrlInputChange(e.target.value)}
            placeholder="https://ejemplo.com/imagen-portada.jpg"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[oklch(0.88_0.04_145)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
      )}
    </div>
  )
}
