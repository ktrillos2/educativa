"use client"

import { useState, useEffect, useRef } from "react"
import { Download } from "@/components/ui/icons"
import { recordDownload } from "@/app/actions/record-download"

interface DownloadButtonProps {
    courseId: string
    type: "CERTIFICATE" | "ACTA"
    label: string
    className?: string
    iconClassName?: string
    autoDownload?: boolean
    hasDownloadedBefore?: boolean
}

export function DownloadCertificateButton({ courseId, type, label, className = "", iconClassName = "w-5 h-5", autoDownload = false, hasDownloadedBefore = false }: DownloadButtonProps) {
    const [loading, setLoading] = useState(false)
    const [showPayAlert, setShowPayAlert] = useState(false)
    const [confirming, setConfirming] = useState(false)
    const [isDownloaded, setIsDownloaded] = useState(hasDownloadedBefore)
    const hasDownloaded = useRef(false)

    // Sincronizar el estado local si cambia la prop
    useEffect(() => {
        if (hasDownloadedBefore) {
            setIsDownloaded(true)
        }
    }, [hasDownloadedBefore])

    const startDownload = async () => {
        if (isDownloaded) {
            setShowPayAlert(true)
            return
        }
        setConfirming(true)
    }

    const executeDownload = async () => {
        setConfirming(false)
        setLoading(true)

        try {
            if (type === "ACTA") {
                window.print()
                await recordDownload(courseId, type).catch(() => {})
                setIsDownloaded(true)
                return
            }

            const html2canvas = (await import("html2canvas")).default
            const { jsPDF } = await import("jspdf")

            const elementId = type === "CERTIFICATE" ? "certificate" : "academic-record"
            const element = document.getElementById(elementId)

            if (!element) {
                console.error(`No se encontró el elemento #${elementId}`)
                return
            }

            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                imageTimeout: 15000,
                // Forzar viewport desktop para que las clases md: apliquen correctamente
                windowWidth: 1280,
                windowHeight: 800,
                onclone: (_doc, clonedEl) => {
                    const cert = clonedEl.querySelector<HTMLElement>("#" + elementId)
                    if (cert) {
                        // Promover clases md: y lg: a base para forzar el layout de escritorio
                        const allElements = cert.querySelectorAll("*")
                        allElements.forEach(el => {
                            if (typeof el.className === 'string') {
                                let newClassName = el.className;
                                
                                // Extraer md: y lg:
                                const classes = newClassName.split(" ")
                                const desktopClasses: string[] = []
                                classes.forEach(c => {
                                    if (c.startsWith("md:") || c.startsWith("lg:")) {
                                        desktopClasses.push(c.replace(/^(md:|lg:)/, ""))
                                    }
                                })
                                
                                el.className = newClassName
                                if (desktopClasses.length > 0) {
                                    el.classList.add(...desktopClasses)
                                }
                                
                                // Forzar visibilidad de elementos ocultos (QR y Código)
                                if (newClassName.includes("hidden")) {
                                    (el as HTMLElement).style.display = "flex"
                                }
                            }
                        })

                        // Quitar mix-blend-multiply de la firma
                        const firmaImg = cert.querySelector<HTMLImageElement>("img[alt='Firma Director']")
                        if (firmaImg) {
                            firmaImg.style.mixBlendMode = "normal"
                        }

                        // Ajustar logos específicamente para el PDF (hacerlos más grandes y centrarlos más)
                        if (type === "CERTIFICATE") {
                            const leftLogoContainer = cert.querySelector<HTMLElement>("img[alt='Mención']")?.parentElement
                            const rightLogoContainer = cert.querySelector<HTMLElement>("img[alt='Logo Academia']")?.parentElement
                            
                            if (leftLogoContainer) {
                                // Quitar márgenes negativos (-ml-12, etc) y aumentar tamaño
                                leftLogoContainer.className = leftLogoContainer.className.replace(/-ml-\d+/g, '')
                                leftLogoContainer.classList.add('w-32', 'h-32') // Forzar un tamaño mayor
                                leftLogoContainer.style.marginLeft = '1rem' // Darle un poco de margen positivo
                            }
                            
                            if (rightLogoContainer) {
                                // Quitar márgenes negativos (-mr-12, etc) y aumentar tamaño
                                rightLogoContainer.className = rightLogoContainer.className.replace(/-mr-\d+/g, '')
                                rightLogoContainer.classList.add('w-32', 'h-32') // Forzar un tamaño mayor
                                rightLogoContainer.style.marginRight = '1rem' // Darle un poco de margen positivo
                            }
                        }
                    }
                },
            })

            const imgData = canvas.toDataURL("image/png", 1.0)

            if (type === "CERTIFICATE") {
                const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
                const pageW = 297
                const pageH = 210
                const canvasAspect = canvas.width / canvas.height
                const pageAspect = pageW / pageH

                let imgW: number, imgH: number, x: number, y: number
                if (canvasAspect > pageAspect) {
                    imgW = pageW
                    imgH = pageW / canvasAspect
                    x = 0
                    y = (pageH - imgH) / 2
                } else {
                    imgH = pageH
                    imgW = pageH * canvasAspect
                    x = (pageW - imgW) / 2
                    y = 0
                }

                pdf.addImage(imgData, "PNG", x, y, imgW, imgH)
                pdf.save(`Diploma-${courseId}.pdf`)
            } else {
                const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
                const pageW = 210
                const pageH = 297
                const canvasAspect = canvas.width / canvas.height
                const pageAspect = pageW / pageH

                let imgW: number, imgH: number, x: number, y: number
                if (canvasAspect > pageAspect) {
                    imgW = pageW
                    imgH = pageW / canvasAspect
                    x = 0
                    y = (pageH - imgH) / 2
                } else {
                    imgH = pageH
                    imgW = pageH * canvasAspect
                    x = (pageW - imgW) / 2
                    y = 0
                }

                pdf.addImage(imgData, "PNG", x, y, imgW, imgH)
                pdf.save(`Acta-${courseId}.pdf`)
            }
        } catch (error) {
            console.error("Error al generar el PDF:", error)
            window.print()
        } finally {
            await recordDownload(courseId, type).catch(() => {})
            setIsDownloaded(true)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (autoDownload && !hasDownloaded.current) {
            hasDownloaded.current = true
            // Pequeño delay para asegurar que fuentes/imágenes estén cargadas
            setTimeout(() => {
                executeDownload()
            }, 1000)
        }
    }, [autoDownload])

    return (
        <div className="flex flex-col items-center gap-2">
            {!confirming ? (
                <>
                    <button
                        onClick={startDownload}
                        disabled={loading}
                        className={`flex items-center gap-2 transition-all ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${isDownloaded ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
                    >
                        <Download className={iconClassName} />
                        {loading ? "Generando PDF..." : isDownloaded ? "VOLVER A DESCARGAR" : label}
                    </button>
                    
                    {isDownloaded && (
                        <div className="text-center">
                            <p className="text-xs font-bold text-amber-700">Tiene un valor de $40.000</p>
                            {showPayAlert ? (
                                <p className="text-[10px] text-muted-foreground mt-1 bg-amber-50 p-2 rounded border border-amber-200">
                                    Por favor, comunícate con el profesor o administración para procesar el pago y habilitar la descarga nuevamente.
                                </p>
                            ) : (
                                <p className="text-[10px] text-muted-foreground cursor-pointer hover:underline" onClick={() => setShowPayAlert(true)}>Contactar al profesor</p>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-left shadow-lg max-w-sm">
                    <p className="text-sm font-bold text-amber-800 mb-2">¡Atención! Única descarga gratuita</p>
                    <p className="text-xs text-amber-700 mb-4">
                        Recuerda que solo tienes permitida <strong>UNA (1) descarga gratuita</strong> de este documento. Asegúrate de estar en un dispositivo seguro donde puedas guardar el archivo ahora mismo.
                    </p>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setConfirming(false)} className="px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 rounded transition-colors">
                            Cancelar
                        </button>
                        <button onClick={executeDownload} className="px-3 py-1.5 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 rounded transition-colors shadow-sm">
                            Sí, descargar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
