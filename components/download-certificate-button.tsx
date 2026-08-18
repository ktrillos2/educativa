"use client"

import { useState } from "react"
import { Download } from "@/components/ui/icons"
import { recordDownload } from "@/app/actions/record-download"

interface DownloadButtonProps {
    courseId: string
    type: "CERTIFICATE" | "ACTA"
    label: string
    className?: string
    iconClassName?: string
}

export function DownloadCertificateButton({ courseId, type, label, className = "", iconClassName = "w-5 h-5" }: DownloadButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        setLoading(true)
        try {
            await recordDownload(courseId, type).catch(() => {})

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
