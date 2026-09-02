'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function simulatePayment(courseId: string) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return { success: false, error: 'No autenticado' }
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('enrollments')
      .update({ payment_verified: true })
      .eq('user_id', session.userId)
      .eq('course_id', courseId)
      .select()

    if (error) {
      console.error("Error al simular pago:", error)
      return { success: false, error: 'Error en la base de datos' }
    }
    
    if (!data || data.length === 0) {
      console.error("simulatePayment no encontró la inscripción:", session.userId, courseId)
      return { success: false, error: 'Inscripción no encontrada para actualizar' }
    }

    revalidatePath(`/estudiante/cursos/${courseId}`)
    revalidatePath(`/diplomados/${courseId}`)
    revalidatePath(`/formacion-academica/${courseId}`)
    revalidatePath(`/`)

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
