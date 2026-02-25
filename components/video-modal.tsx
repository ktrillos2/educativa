"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface VideoModalProps {
    isOpen: boolean
    onClose: () => void
    videoUrl: string
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 bg-black/90 border-none overflow-hidden h-[80vh] flex items-center justify-center">
                {isOpen && (
                    <iframe
                        className="w-full h-full"
                        src={videoUrl}
                        title="Video Institucional"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                )}
            </DialogContent>
        </Dialog>
    )
}
