import { Question, FALLBACK_QUESTIONS, COURSE_9_QUESTIONS } from "./exam-constants";
import { createAdminClient } from "@/utils/supabase/admin";

/**
 * Returns the full questions (including correct answers) for a given course module.
 * Reads from the exams_data JSONB column in the courses table (Supabase).
 * Falls back to hardcoded questions if none are configured.
 */
export async function getFullQuestionsForCourse(courseId: string, moduleId: string): Promise<Question[]> {
    try {
        const supabase = createAdminClient()
        const { data: course, error } = await supabase
            .from("courses")
            .select("exams_data")
            .eq("id", courseId)
            .maybeSingle()

        if (!error && course?.exams_data) {
            const examsMap = course.exams_data as Record<string, Question[]>
            if (examsMap[moduleId] && Array.isArray(examsMap[moduleId]) && examsMap[moduleId].length > 0) {
                return examsMap[moduleId]
            }
        }
    } catch (e) {
        console.error("Error reading course exam data from Supabase:", e)
    }

    if (courseId === "gestion-presupuesto-publico" && COURSE_9_QUESTIONS[moduleId]) {
        return COURSE_9_QUESTIONS[moduleId]
    }

    return []
}

/**
 * Returns questions without sensitive fields (correct answer, feedback) for the client.
 */
export async function getQuestionsForClient(courseId: string, moduleId: string) {
    const questionsList = await getFullQuestionsForCourse(courseId, moduleId)

    return questionsList.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
    }));
}
