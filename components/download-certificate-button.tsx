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
}

export function DownloadCertificateButton({ courseId, type, label, className = "", iconClassName = "w-5 h-5", autoDownload = false }: DownloadButtonProps) {
    const [loading, setLoading] = useState(false)
    const hasDownloaded = useRef(false)

    const handleDownload = async () => {
        setLoading(true)
        try {
            await recordDownload(courseId, type).catch(() => {})

            if (type === "ACTA") {
                window.print()
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
            setLoading(false)
        }
    }

    useEffect(() => {
        if (autoDownload && !hasDownloaded.current) {
            hasDownloaded.current = true
            // Pequeño delay para asegurar que fuentes/imágenes estén cargadas
            setTimeout(() => {
                handleDownload()
            }, 1000)
        }
    }, [autoDownload])

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className={`flex items-center gap-2 transition-all ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            <Download className={iconClassName} />
            {loading ? "Generando PDF..." : label}
        </button>
    )
}
