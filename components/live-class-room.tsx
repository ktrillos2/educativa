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
        "Microphone": "Micrófono",
        "Camera": "Cámara",
        "Chat": "Chat",
        "Share Screen": "Compartir pantalla",
        "Stop sharing": "Dejar de compartir",
        "Unmute": "Activar Micrófono",
        "Mute": "Silenciar Micrófono",
        "Start video": "Iniciar Cámara",
        "Stop video": "Detener Cámara",
        "Send": "Enviar"
      };

      document.querySelectorAll('.lk-button').forEach(el => {
        const title = el.getAttribute('title');
        if (title && translations[title]) {
          el.setAttribute('title', translations[title]);
        }
        const textEl = el.querySelector('.lk-button-text');
        if (textEl && textEl.textContent && translations[textEl.textContent.trim()]) {
          textEl.textContent = translations[textEl.textContent.trim()];
        }
      });
      
      document.querySelectorAll('.lk-chat-form-input').forEach(el => {
        if (el.getAttribute('placeholder') === 'Enter a message...') {
           el.setAttribute('placeholder', 'Escribe un mensaje...');
        }
      });
      
      document.querySelectorAll('.lk-participant-placeholder').forEach(el => {
          if (el.textContent === 'No video') el.textContent = 'Sin video';
      });
    };

    const observer = new MutationObserver(() => {
      translate();
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
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
