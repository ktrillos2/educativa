"use client"

import { useState, useRef, useEffect } from "react"
import { Video, Square, Loader2, CheckCircle2, AlertCircle, Maximize, Mic } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { finishClassWithRecording } from "@/app/actions/class-management"

type RecorderState = "idle" | "recording" | "uploading" | "success" | "error"

export function ScreenRecorder({ classId, courseId }: { classId: string, courseId: string }) {
  const [state, setState] = useState<RecorderState>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [time, setTime] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (state === "recording") {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [state])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  const startRecording = async () => {
    try {
      setErrorMsg("")
      // Request screen sharing
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: true // Captures system/tab audio if supported
      })

      // Request microphone
      let voiceStream: MediaStream | null = null;
      try {
        voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (err) {
        console.warn("Could not get microphone access:", err)
      }

      // Combine tracks
      const tracks = [...displayStream.getTracks()]
      if (voiceStream) {
        tracks.push(...voiceStream.getTracks())
      }

      const combinedStream = new MediaStream(tracks)
      streamRef.current = combinedStream

      // Handle user stopping screen share from browser UI directly
      displayStream.getVideoTracks()[0].onended = () => {
        if (state === "recording") {
          stopRecording()
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9,opus' // Standard high quality web format
      })
      
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = handleStop
      
      recorder.start(1000) // Collect chunks every second to be safe
      setState("recording")
      setTime(0)
      setIsExpanded(true)

    } catch (err: any) {
      console.error("Recording error:", err)
      setState("error")
      setErrorMsg(err.message || "Error al iniciar la grabación. Verifica los permisos del navegador.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop()
      // Stop all tracks to release camera/mic
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }

  const handleStop = async () => {
    setState("uploading")
    try {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      if (blob.size === 0) throw new Error("El video grabado está vacío.")

      const supabase = createClient()
      const fileName = `${classId}-${Date.now()}.webm`
      const filePath = `videos/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'video/webm'
        })

      if (uploadError) throw new Error(uploadError.message)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(filePath)

      // Save to database
      const actionFormData = new FormData()
      actionFormData.append("class_id", classId)
      actionFormData.append("course_id", courseId)
      actionFormData.append("file_url", publicUrl)
      
      const result = await finishClassWithRecording(actionFormData)
      
      if (result?.error) throw new Error(result.error)

      setState("success")
    } catch (err: any) {
      console.error("Upload error:", err)
      setState("error")
      setErrorMsg(err.message || "Ocurrió un error al subir la grabación.")
    }
  }

  if (state === "success") {
    return (
      <div className="absolute top-4 left-4 z-50 bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
        <CheckCircle2 className="w-6 h-6 text-green-600" />
        <div>
          <p className="font-bold text-sm">Grabación Subida</p>
          <p className="text-xs">La clase se ha guardado y finalizado correctamente.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`absolute top-4 left-4 z-50 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'}`}>
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-border p-4">
        
        {!isExpanded && state === "recording" && (
          <button onClick={() => setIsExpanded(true)} className="flex items-center gap-2 group">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="font-mono text-sm font-bold text-red-600 group-hover:underline">{formatTime(time)}</span>
            <Maximize className="w-4 h-4 ml-2 text-gray-500" />
          </button>
        )}

        {(isExpanded || state !== "recording") && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" /> 
                Grabador de Clase
              </h3>
              {state === "recording" && (
                <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-700">
                  <span className="sr-only">Minimizar</span>
                  <Maximize className="w-4 h-4" />
                </button>
              )}
            </div>

            {state === "idle" && (
              <>
                <p className="text-xs text-gray-500">
                  Graba tu pantalla y micrófono. El video se subirá automáticamente al terminar.
                </p>
                <button 
                  onClick={startRecording}
                  className="w-full bg-red-600 text-white font-bold text-sm py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  Iniciar Grabación
                </button>
              </>
            )}

            {state === "recording" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-3 bg-red-50 py-3 rounded-lg border border-red-100">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-mono font-bold text-red-600 text-xl">{formatTime(time)}</span>
                </div>
                <button 
                  onClick={stopRecording}
                  className="w-full bg-gray-900 text-white font-bold text-sm py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Detener y Subir
                </button>
              </div>
            )}

            {state === "uploading" && (
              <div className="flex flex-col items-center justify-center gap-2 py-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-bold text-gray-700">Subiendo video a Supabase...</p>
                <p className="text-xs text-gray-500">Por favor, no cierres esta ventana.</p>
              </div>
            )}

            {state === "error" && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex gap-2 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{errorMsg}</p>
                </div>
                <button 
                  onClick={() => setState("idle")}
                  className="w-full mt-3 bg-white text-gray-700 text-xs font-bold py-1.5 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
