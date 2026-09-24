"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import fs from "fs"
import path from "path"
import { Question, COURSE_9_QUESTIONS, FALLBACK_QUESTIONS } from "@/lib/exam-data"
import { extractTextFromPdfBuffer } from "@/lib/pdf-parser"

export async function checkAdminSession() {
  const session = await getSession()
  if (!session?.userId) {
    throw new Error("No autorizado. Inicia sesión como administrador.")
  }
}

export async function getCourseModulesData(courseId: string) {
  await checkAdminSession()
  const supabase = createAdminClient()

  // 1. Fetch course details
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .maybeSingle()

  if (error || !course) {
    return { error: "Curso no encontrado." }
  }

  const modulesCount = Math.max(course.modules || 1, 1)

  // 2. Check existing PDF files in diplomados directory
  const diplomadosDir = path.join(process.cwd(), "diplomados")
  if (!fs.existsSync(diplomadosDir)) {
    fs.mkdirSync(diplomadosDir, { recursive: true })
  }

  const pdfFilesStatus: Record<string, boolean> = {}
  const examPdfStatus: Record<string, boolean> = {}
  for (let i = 1; i <= modulesCount; i++) {
    const docName = `Modulo ${i} - ${courseId}.pdf`
    const filePath = path.join(diplomadosDir, docName)
    pdfFilesStatus[`mod-${i}`] = fs.existsSync(filePath)

    const examDocName = `Cuestionario Modulo ${i} - ${courseId}.pdf`
    const examFilePath = path.join(diplomadosDir, examDocName)
    examPdfStatus[`mod-${i}`] = fs.existsSync(examFilePath)
  }

  // 3. Load exams data
  let examsData: Record<string, Question[]> = {}
  const examsFilePath = path.join(diplomadosDir, `exams_${courseId}.json`)

  if (fs.existsSync(examsFilePath)) {
    try {
      const content = fs.readFileSync(examsFilePath, "utf-8")
      examsData = JSON.parse(content)
    } catch (e) {
      console.error("Error parsing exams json:", e)
    }
  }

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

  return {
    success: true,
    course,
    modulesCount,
    pdfFilesStatus,
    examPdfStatus,
    examsData,
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

  const diplomadosDir = path.join(process.cwd(), "diplomados")
  if (!fs.existsSync(diplomadosDir)) {
    fs.mkdirSync(diplomadosDir, { recursive: true })
  }

  const targetFileName = `Modulo ${moduleIndex} - ${courseId}.pdf`
  const targetFilePath = path.join(diplomadosDir, targetFileName)

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(targetFilePath, buffer)

    // Update course modules count if needed
    const supabase = createAdminClient()
    const { data: course } = await supabase
      .from("courses")
      .select("modules")
      .eq("id", courseId)
      .single()

    if (course && (course.modules || 0) < moduleIndex) {
      await supabase
        .from("courses")
        .update({ modules: moduleIndex })
        .eq("id", courseId)
    }

    revalidatePath(`/admin/cursos`)
    revalidatePath(`/admin/cursos/${courseId}/modulos`)
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/estudiante/cursos/${courseId}`)

    return {
      success: true,
      message: `El archivo ${targetFileName} fue cargado correctamente.`,
      moduleIndex,
      fileName: targetFileName,
    }
  } catch (err) {
    console.error("Error saving PDF file:", err)
    return { error: "No se pudo guardar el archivo PDF en el servidor." }
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
    
    // Save the PDF
    const diplomadosDir = path.join(process.cwd(), "diplomados")
    if (!fs.existsSync(diplomadosDir)) {
      fs.mkdirSync(diplomadosDir, { recursive: true })
    }
    const targetFileName = `Cuestionario Modulo ${moduleIndex} - ${courseId}.pdf`
    const targetFilePath = path.join(diplomadosDir, targetFileName)
    fs.writeFileSync(targetFilePath, buffer)

    // Parse the PDF
    const text = await extractTextFromPdfBuffer(buffer)

    if (!text || text.trim().length === 0) {
      return {
        error: "Archivo guardado, pero no se pudo extraer texto legible del PDF. Es posible que sea una imagen escaneada.",
      }
    }

    const parseResult = await parseExamTextAction(text, moduleIndex)

    return {
      success: true,
      text,
      questions: parseResult.questions || [],
      message: parseResult.questions && parseResult.questions.length > 0
        ? `Evaluación guardada. Se extrajeron ${parseResult.questions.length} preguntas del archivo PDF.`
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

  const diplomadosDir = path.join(process.cwd(), "diplomados")
  if (!fs.existsSync(diplomadosDir)) {
    fs.mkdirSync(diplomadosDir, { recursive: true })
  }

  const examsFilePath = path.join(diplomadosDir, `exams_${courseId}.json`)

  try {
    // Write JSON file for exams
    fs.writeFileSync(examsFilePath, JSON.stringify(examsData, null, 2), "utf-8")

    // Update modules count in database
    const supabase = createAdminClient()
    await supabase
      .from("courses")
      .update({ modules: modulesCount })
      .eq("id", courseId)

    revalidatePath(`/admin/cursos`)
    revalidatePath(`/admin/cursos/${courseId}/modulos`)
    revalidatePath(`/diplomados`)
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/formacion-academica`)
    revalidatePath(`/estudiante/cursos/${courseId}`)

    return { success: true, message: "Módulos y evaluaciones guardados exitosamente." }
  } catch (err) {
    console.error("Error saving exams data:", err)
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
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

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

      const result = await model.generateContent(prompt)
      let responseText = result.response.text().trim()
      
      // Clean markdown formatting if present
      if (responseText.startsWith("```json")) {
        responseText = responseText.replace(/^```json\n?/, "").replace(/\n?```$/, "")
      }
      
      const parsedAiQuestions = JSON.parse(responseText)
      
      if (!Array.isArray(parsedAiQuestions) || parsedAiQuestions.length === 0) {
        // AI found no questions
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
    
    // Split by PREGUNTA or Pregunta or 1., 2. patterns
    const questionBlocks = rawText.split(/(?:PREGUNTA\s+\d+|Pregunta\s+\d+|\b\d+[\.\)]\s+(?=[A-Z0-9¿¡]))/i)
    
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
        
        // Match option line: A. , B. , C. , D. or a), b), c), d)
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
        // Fill up to 4 options if fewer
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
  
  try {
    const fileName = type === "exam"
      ? `Cuestionario Modulo ${moduleIndex} - ${courseId}.pdf`
      : `Modulo ${moduleIndex} - ${courseId}.pdf`
      
    const targetFilePath = path.join(process.cwd(), "diplomados", fileName)
    
    if (fs.existsSync(targetFilePath)) {
      fs.unlinkSync(targetFilePath)
      
      revalidatePath(`/admin/cursos`)
      revalidatePath(`/admin/cursos/${courseId}/modulos`)
      revalidatePath(`/diplomados/${courseId}`)
      revalidatePath(`/estudiante/cursos/${courseId}`)
      
      return { success: true, message: "PDF eliminado correctamente." }
    }
    
    return { error: "El archivo PDF no existe." }
  } catch (err) {
    console.error("Error eliminando PDF:", err)
    return { error: "Ocurrió un error al eliminar el PDF." }
  }
}
