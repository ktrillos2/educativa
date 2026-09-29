"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { Question, COURSE_9_QUESTIONS, FALLBACK_QUESTIONS } from "@/lib/exam-constants"
import { extractTextFromPdfBuffer } from "@/lib/pdf-parser"

/** Supabase Storage bucket for module PDFs (private). */
const MODULES_BUCKET = "course-modules"

/** Builds the storage path for a module PDF. */
function modulePdfPath(courseId: string, moduleIndex: number) {
  return `${courseId}/modulo-${moduleIndex}.pdf`
}

export async function checkAdminSession() {
  const session = await getSession()
  if (!session?.userId) {
    throw new Error("No autorizado. Inicia sesión como administrador.")
  }
}

export async function getCourseModulesData(courseId: string) {
  await checkAdminSession()
  const supabase = createAdminClient()

  // 1. Fetch course details (including exams_data and module_pdfs columns)
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .maybeSingle()

  if (error || !course) {
    return { error: "Curso no encontrado." }
  }

  const modulesCount = Math.max(course.modules || 1, 1)

  // 2. Build PDF status from the module_pdfs JSONB column (stored in DB)
  const storedPdfs: Record<string, boolean> = course.module_pdfs || {}
  const storedExamPdfs: Record<string, boolean> = course.exam_pdfs || {}

  const pdfFilesStatus: Record<string, boolean> = {}
  const examPdfStatus: Record<string, boolean> = {}
  for (let i = 1; i <= modulesCount; i++) {
    pdfFilesStatus[`mod-${i}`] = Boolean(storedPdfs[`mod-${i}`])
    examPdfStatus[`mod-${i}`] = Boolean(storedExamPdfs[`mod-${i}`])
  }

  // 3. Load exams data from JSONB column
  let examsData: Record<string, Question[]> = course.exams_data || {}

  // Fallbacks if not set
  for (let i = 1; i <= modulesCount; i++) {
    const modKey = `mod-${i}`
    if (!examsData[modKey] || examsData[modKey].length === 0) {
      if (courseId === "9" && COURSE_9_QUESTIONS[modKey]) {
        examsData[modKey] = COURSE_9_QUESTIONS[modKey]
      } else {
        examsData[modKey] = JSON.parse(JSON.stringify(FALLBACK_QUESTIONS))
      }
    }
  }

  // 4. Fetch General Info PDF URLs (Diplomados & ETDH)
  const { data: infoSettings } = await supabase
    .from("platform_settings")
    .select("key, value")
    .in("key", ["info_diplomados_pdf", "info_etdh_pdf"])

  let generalDiplomadosPdfUrl: string | null = null
  let generalEtdhPdfUrl: string | null = null

  if (infoSettings) {
    for (const setting of infoSettings) {
      if (setting.key === "info_diplomados_pdf" && setting.value) generalDiplomadosPdfUrl = String(setting.value).trim()
      if (setting.key === "info_etdh_pdf" && setting.value) generalEtdhPdfUrl = String(setting.value).trim()
    }
  }

  return {
    success: true,
    course,
    modulesCount,
    pdfFilesStatus,
    examPdfStatus,
    examsData,
    generalDiplomadosPdfUrl,
    generalEtdhPdfUrl,
  }
}

export async function uploadModulePdfAction(formData: FormData) {
  await checkAdminSession()

  const courseId = formData.get("courseId") as string
  const moduleIndex = Number(formData.get("moduleIndex"))
  const file = formData.get("file") as File

  if (!courseId || !moduleIndex || !file || file.size === 0) {
    return { error: "Faltan datos o el archivo PDF está vacío." }
  }

  if (file.type !== "application/pdf") {
    return { error: "Solo se aceptan archivos PDF." }
  }

  const maxSizeBytes = 50 * 1024 * 1024 // 50 MB
  if (file.size > maxSizeBytes) {
    return { error: `El archivo pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El límite es 50 MB.` }
  }

  const supabase = createAdminClient()
  const storagePath = modulePdfPath(courseId, moduleIndex)

  try {
    const arrayBuffer = await file.arrayBuffer()

    // Upload to Supabase Storage (upsert = overwrite if exists)
    const { error: uploadError } = await supabase.storage
      .from(MODULES_BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType: "application/pdf",
        upsert: true,
      })

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError)
      return { error: `Error al subir el PDF: ${uploadError.message}` }
    }

    // Mark this module as having a PDF in the module_pdfs JSONB column
    const { data: courseData } = await supabase
      .from("courses")
      .select("module_pdfs, modules")
      .eq("id", courseId)
      .single()

    const currentPdfs = (courseData?.module_pdfs as Record<string, boolean>) || {}
    currentPdfs[`mod-${moduleIndex}`] = true

    const newModulesCount = Math.max(courseData?.modules || 0, moduleIndex)

    await supabase
      .from("courses")
      .update({
        module_pdfs: currentPdfs,
        modules: newModulesCount,
      } as any)
      .eq("id", courseId)

    revalidatePath(`/admin/cursos`)
    revalidatePath(`/admin/cursos/${courseId}/modulos`)
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/estudiante/cursos/${courseId}`)

    const targetFileName = `Modulo ${moduleIndex} - ${courseId}.pdf`
    return {
      success: true,
      message: `El archivo ${targetFileName} fue cargado correctamente.`,
      moduleIndex,
      fileName: targetFileName,
    }
  } catch (err: any) {
    console.error("Error uploading PDF to Supabase Storage:", err)
    return { error: `No se pudo guardar el archivo PDF en el servidor: ${err?.message || "Error desconocido"}` }
  }
}

export async function parsePdfFileAction(formData: FormData, moduleIndex: number, courseId: string) {
  await checkAdminSession()

  const file = formData.get("file") as File
  if (!file || file.size === 0) {
    return { error: "Selecciona un archivo PDF válido." }
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload the exam PDF to Supabase Storage
    const supabase = createAdminClient()
    const storagePath = `${courseId}/cuestionario-modulo-${moduleIndex}.pdf`

    const { error: uploadError } = await supabase.storage
      .from(MODULES_BUCKET)
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      })

    if (uploadError) {
      console.error("Supabase Storage exam PDF upload error:", uploadError)
      return { error: `Error al subir el PDF del cuestionario: ${uploadError.message}` }
    }

    // Mark exam PDF as uploaded
    const { data: courseData } = await supabase
      .from("courses")
      .select("exam_pdfs")
      .eq("id", courseId)
      .single()

    const currentExamPdfs = ((courseData as any)?.exam_pdfs as Record<string, boolean>) || {}
    currentExamPdfs[`mod-${moduleIndex}`] = true

    await supabase
      .from("courses")
      .update({ exam_pdfs: currentExamPdfs } as any)
      .eq("id", courseId)

    // Parse the PDF text on the server
    const text = await extractTextFromPdfBuffer(buffer)

    if (!text || text.trim().length === 0) {
      return {
        error: "Archivo guardado, pero no se pudo extraer texto legible del PDF. Es posible que sea una imagen escaneada.",
      }
    }

    // Call the text-based parser
    const parseResult = await parseExamTextAction(text, moduleIndex)

    return {
      success: true,
      text,
      questions: parseResult.questions || [],
      message: parseResult.questions && parseResult.questions.length > 0
        ? `Evaluación guardada. Se extrajeron ${parseResult.questions.length} preguntas del archivo PDF (Procesado como Texto).`
        : "Evaluación guardada. Se extrajo el texto, pero no se detectaron preguntas con formato A/B/C/D.",
    }
  } catch (err: any) {
    console.error("Error parsing PDF file:", err)
    return { error: `Error al guardar y leer el archivo PDF de la evaluación: ${err?.message || "Desconocido"}` }
  }
}

export async function saveCourseExamsAction(
  courseId: string,
  modulesCount: number,
  examsData: Record<string, Question[]>
) {
  await checkAdminSession()

  if (!courseId || modulesCount < 1) {
    return { error: "Parámetros inválidos." }
  }

  const supabase = createAdminClient()

  try {
    // Save exams as JSONB in the courses table
    await supabase
      .from("courses")
      .update({
        exams_data: examsData,
        modules: modulesCount,
      } as any)
      .eq("id", courseId)

    revalidatePath(`/admin/cursos`)
    revalidatePath(`/admin/cursos/${courseId}/modulos`)
    revalidatePath(`/diplomados`)
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/formacion-academica`)
    revalidatePath(`/estudiante/cursos/${courseId}`)

    return { success: true, message: "Módulos y evaluaciones guardados exitosamente." }
  } catch (err) {
    console.error("Error saving exams data to Supabase:", err)
    return { error: "No se pudo guardar la configuración de evaluaciones." }
  }
}

export async function parseExamTextAction(rawText: string, moduleIndex: number) {
  await checkAdminSession()

  if (!rawText || rawText.trim().length === 0) {
    return { error: "El texto ingresado está vacío." }
  }

  // Attempt to use AI if API key is present
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai")
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" })

      const prompt = `Extrae todas las preguntas de opción múltiple del siguiente texto y devuélvelas en un JSON array estricto con el formato especificado.
Ignora índices, tablas de contenido u otros textos que no sean preguntas de opción múltiple (una pregunta con 2 o más alternativas). Si no encuentras ninguna pregunta, devuelve un array vacío [].
Formato JSON esperado para cada pregunta:
{
  "question": "Enunciado de la pregunta",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correct": 0, // Índice de la respuesta correcta (0 para A, 1 para B, etc)
  "feedbackCorrect": "Retroalimentación opcional o dejar en blanco",
  "feedbackIncorrect": "Retroalimentación opcional o dejar en blanco"
}

Asegúrate de deducir la respuesta correcta si se indica (por ej. con la palabra Clave, Respuesta, Correcta) o asume 0 si no se encuentra. Todas las preguntas deben tener idénticamente 4 opciones (completa con opciones en blanco si hay menos).
Texto a analizar:
"""
${rawText}
"""
Solo responde con el código JSON, sin formato markdown ni texto adicional.`;

      let result;
      let retries = 3;
      let delay = 2000;
      
      while (retries > 0) {
        try {
          result = await model.generateContent(prompt)
          break;
        } catch (error: any) {
          if (error?.message?.includes("503") || error?.status === 503) {
            retries--;
            if (retries === 0) throw error;
            console.log(`[Gemini 503 Error] Reintentando en ${delay}ms... (${retries} intentos restantes)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
          } else {
            throw error;
          }
        }
      }
      
      if (!result) throw new Error("No se pudo obtener respuesta de la IA.");

      let responseText = result.response.text().trim()
      
      // Clean markdown formatting if present
      if (responseText.startsWith("```json")) {
        responseText = responseText.replace(/^```json\n?/, "").replace(/\n?```$/, "")
      }
      
      const parsedAiQuestions = JSON.parse(responseText)
      
      if (!Array.isArray(parsedAiQuestions) || parsedAiQuestions.length === 0) {
        return { error: "No se pudieron identificar preguntas en este texto. Asegúrate de incluir los enunciados y sus opciones." }
      }

      // Map to proper Question format
      const finalQuestions: Question[] = parsedAiQuestions.map((q: any, idx: number) => ({
        id: `m${moduleIndex}-q${idx + 1}`,
        question: q.question || "Pregunta",
        options: Array.isArray(q.options) ? q.options.slice(0, 4) : ["Opción A", "Opción B", "Opción C", "Opción D"],
        correct: typeof q.correct === 'number' ? q.correct : 0,
        feedbackCorrect: q.feedbackCorrect || "¡Respuesta correcta!",
        feedbackIncorrect: q.feedbackIncorrect || "Revisa el material de estudio."
      }))

      return { success: true, questions: finalQuestions }

    } catch (err) {
      console.error("AI Parsing Error:", err)
      // Fallback to manual parsing below if AI fails
    }
  }

  // Fallback Manual Parser
  try {
    const questions: Question[] = []
    
    const questionBlocks = rawText.split(/(?:PREGUNTA\s+\d+|Pregunta\s+\d+|\b\d+[\.]\s+(?=[A-Z0-9¿¡]))/i)
    
    let qCount = 1
    for (const rawBlock of questionBlocks) {
      const block = rawBlock.trim()
      if (!block || block.length < 10) continue

      const lines = block.split("\n").map((l) => l.trim()).filter((l) => l.length > 0)
      if (lines.length < 2) continue

      let qText = ""
      const options: string[] = []
      let correctIdx = 0

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j]
        
        const optionMatch = line.match(/^([A-D])[.)]\s*(.+)$/i)
        if (optionMatch) {
          options.push(optionMatch[2].trim())
        } else if (line.match(/^(?:Clave|Respuesta|Correcta):\s*([A-D])/i)) {
          const letterMatch = line.match(/^(?:Clave|Respuesta|Correcta):\s*([A-D])/i)
          if (letterMatch) {
            const letter = letterMatch[1].toUpperCase()
            if (letter === "A") correctIdx = 0
            if (letter === "B") correctIdx = 1
            if (letter === "C") correctIdx = 2
            if (letter === "D") correctIdx = 3
          }
        } else if (options.length === 0) {
          qText += (qText ? " " : "") + line.replace(/^[\s·:-]+/, "")
        }
      }

      if (qText && options.length >= 2) {
        while (options.length < 4) {
          options.push(`Opción ${options.length + 1}`)
        }

        questions.push({
          id: `m${moduleIndex}-q${qCount}`,
          question: qText,
          options: options.slice(0, 4),
          correct: correctIdx,
          feedbackCorrect: "¡Respuesta correcta! Has asimilado la norma y conceptos clave.",
          feedbackIncorrect: "Revisa el material de estudio para profundizar en este concepto.",
        })
        qCount++
      }
    }

    if (questions.length === 0) {
      return {
        error: "El texto no parece contener evaluaciones. (Si deseas un análisis inteligente, configura la GEMINI_API_KEY en .env.local)",
      }
    }

    return { success: true, questions }
  } catch (err) {
    console.error("Error parsing text:", err)
    return { error: "Ocurrió un error al procesar el texto del examen." }
  }
}

export async function deleteModulePdfAction(courseId: string, moduleIndex: number, type: "content" | "exam") {
  await checkAdminSession()
  
  const supabase = createAdminClient()

  const storagePath = type === "exam"
    ? `${courseId}/cuestionario-modulo-${moduleIndex}.pdf`
    : modulePdfPath(courseId, moduleIndex)

  try {
    const { error: deleteError } = await supabase.storage
      .from(MODULES_BUCKET)
      .remove([storagePath])

    if (deleteError) {
      console.error("Supabase Storage delete error:", deleteError)
      return { error: `Error al eliminar el archivo: ${deleteError.message}` }
    }

    // Update the tracking column in the DB
    const columnKey = type === "exam" ? "exam_pdfs" : "module_pdfs"
    const { data: courseData } = await supabase
      .from("courses")
      .select(columnKey)
      .eq("id", courseId)
      .single()

    const currentMap = ((courseData as any)?.[columnKey] as Record<string, boolean>) || {}
    currentMap[`mod-${moduleIndex}`] = false

    await supabase
      .from("courses")
      .update({ [columnKey]: currentMap } as any)
      .eq("id", courseId)

    revalidatePath(`/admin/cursos`)
    revalidatePath(`/admin/cursos/${courseId}/modulos`)
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/estudiante/cursos/${courseId}`)
    
    return { success: true, message: "PDF eliminado correctamente." }
  } catch (err: any) {
    console.error("Error eliminando PDF de Supabase Storage:", err)
    return { error: "Ocurrió un error al eliminar el PDF." }
  }
}

/**
 * Returns a short-lived signed URL (1 hour) for a module PDF stored in Supabase Storage.
 * Used by the /api/file route to serve PDFs without exposing the storage path.
 */
export async function getModulePdfSignedUrl(courseId: string, moduleIndex: number): Promise<string | null> {
  const supabase = createAdminClient()
  const storagePath = modulePdfPath(courseId, moduleIndex)

  const { data, error } = await supabase.storage
    .from(MODULES_BUCKET)
    .createSignedUrl(storagePath, 3600) // 1 hour

  if (error || !data?.signedUrl) {
    console.error("Error creating signed URL:", error)
    return null
  }

  return data.signedUrl
}
