"use client"

import '@livekit/components-styles'
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  useToken,
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

function useTranslateLiveKit() {
  useEffect(() => {
    const translate = () => {
      const translations: Record<string, string> = {
        "Leave": "Salir",
        "Leave Room": "Salir de la clase",
        "Leave room": "Salir de la clase",
        "Microphone": "Micrófono",
        "Camera": "Cámara",
        "Chat": "Chat",
        "Share Screen": "Compartir pantalla",
        "Share screen": "Compartir pantalla",
        "Stop sharing": "Dejar de compartir",
        "Stop Sharing": "Dejar de compartir",
        "Unmute": "Activar Micrófono",
        "Mute": "Silenciar Micrófono",
        "Start video": "Iniciar Cámara",
        "Start Video": "Iniciar Cámara",
        "Stop video": "Detener Cámara",
        "Stop Video": "Detener Cámara",
        "Send": "Enviar",
        "Settings": "Configuración",
        "Audio": "Audio",
        "Video": "Video",
        "Speaker": "Altavoz",
        "Screen share": "Compartir pantalla",
        "Toggle Chat": "Chat",
        "Toggle Microphone": "Micrófono",
        "Toggle Camera": "Cámara",
        "Select a Microphone": "Seleccionar Micrófono",
        "Select a Camera": "Seleccionar Cámara",
        "Select a Speaker": "Seleccionar Altavoz",
        "System Default": "Predeterminado del sistema",
        "No video": "Sin video",
        "You": "Tú",
        "Cancel": "Cancelar",
        "Confirm": "Confirmar",
        "Participants": "Participantes",
        "Enter a message...": "Escribe un mensaje...",
        "Connecting...": "Conectando...",
        "Reconnecting...": "Reconectando...",
        "Connection Lost": "Conexión perdida",
        "Host": "Anfitrión",
        "Presenter": "Presentador",
        "Audio Settings": "Configuración de audio",
        "Video Settings": "Configuración de video"
      };

      document.querySelectorAll('.lk-button, [data-lk-theme] button, [data-lk-theme] span, [data-lk-theme] label, [data-lk-theme] a').forEach(el => {
        const title = el.getAttribute('title');
        if (title && translations[title.trim()]) {
          el.setAttribute('title', translations[title.trim()]);
        }
        const ariaLabel = el.getAttribute('aria-label');
        if (ariaLabel && translations[ariaLabel.trim()]) {
          el.setAttribute('aria-label', translations[ariaLabel.trim()]);
        }
        
        const textEl = el.querySelector('.lk-button-text');
        if (textEl && textEl.textContent && translations[textEl.textContent.trim()]) {
          textEl.textContent = translations[textEl.textContent.trim()];
        } else if (el.children.length === 0 && el.textContent && translations[el.textContent.trim()]) {
          el.textContent = translations[el.textContent.trim()];
        }
      });
      
      document.querySelectorAll('.lk-chat-form-input, [data-lk-theme] input, [data-lk-theme] textarea').forEach(el => {
        const ph = el.getAttribute('placeholder');
        if (ph && translations[ph.trim()]) {
          el.setAttribute('placeholder', translations[ph.trim()]);
        } else if (ph === 'Enter a message...') {
          el.setAttribute('placeholder', 'Escribe un mensaje...');
        }
      });
      
      document.querySelectorAll('.lk-participant-placeholder, [data-lk-theme] .lk-participant-name').forEach(el => {
        if (el.textContent && el.textContent.trim() === 'No video') {
          el.textContent = 'Sin video';
        }
        if (el.textContent && el.textContent.trim().endsWith('(You)')) {
          el.textContent = el.textContent.replace('(You)', '(Tú)');
        }
      });
    };

    const observer = new MutationObserver(() => {
      translate();
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true });
    translate();

    return () => observer.disconnect();
  }, []);
}

export function LiveClassRoom({ 
  roomName, 
  username, 
  courseId 
}: { 
  roomName: string, 
  username: string,
  courseId: string
}) {
  useTranslateLiveKit();
  const [token, setToken] = useState("")
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        const resp = await fetch(`/api/livekit/token?room=${roomName}&username=${encodeURIComponent(username)}`)
        const data = await resp.json()
        if (data.token) {
          setToken(data.token)
        } else {
          console.error("Failed to get token:", data.error)
        }
      } catch (e) {
        console.error("Error fetching token", e)
      }
    })()

    // Cleanup: registrar salida cuando el componente se desmonta (ej: cambian de pestaña)
    return () => {
      // Usamos sendBeacon para garantizar que se envíe incluso al cerrar la pestaña
      navigator.sendBeacon('/api/attendance/leave', JSON.stringify({ classId: roomName }))
    }
  }, [roomName, username])

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Conectando a la sala de clases...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: 'calc(100vh - 100px)' }}
      onDisconnected={() => {
        fetch('/api/attendance/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ classId: roomName })
        }).catch(console.error)
        router.push(`/diplomados/${courseId}`)
      }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
