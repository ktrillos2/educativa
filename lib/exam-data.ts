import { Question, FALLBACK_QUESTIONS, COURSE_9_QUESTIONS } from "./exam-constants";
import fs from "fs"
import path from "path"

export function getFullQuestionsForCourse(courseId: string, moduleId: string): Question[] {
    try {
        const filePath = path.join(process.cwd(), "diplomados", `exams_${courseId}.json`)
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf-8")
            const examsMap = JSON.parse(content)
            if (examsMap && examsMap[moduleId] && Array.isArray(examsMap[moduleId]) && examsMap[moduleId].length > 0) {
                return examsMap[moduleId]
            }
        }
    } catch (e) {
        console.error("Error reading course exam JSON file:", e)
    }

    if (courseId === "gestion-presupuesto-publico" && COURSE_9_QUESTIONS[moduleId]) {
        return COURSE_9_QUESTIONS[moduleId]
    }

    return []
}

export function getQuestionsForClient(courseId: string, moduleId: string) {
    const questionsList = getFullQuestionsForCourse(courseId, moduleId)

    // Retornamos sin correct, feedbackCorrect, feedbackIncorrect
    return questionsList.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
    }));
}


