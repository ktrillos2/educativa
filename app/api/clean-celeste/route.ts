import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // 1. Find Celeste
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email')
      .ilike('name', '%celeste%')

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'No Celeste user found' })
    }

    const celeste = users[0]

    // 2. Fetch all enrollments for Celeste
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', celeste.id)

    const deletedEnrollments = []
    const keptEnrollments = []

    if (enrollments && enrollments.length > 1) {
      // Keep the first enrollment, delete the duplicate ones
      const [primary, ...duplicates] = enrollments
      keptEnrollments.push(primary)

      for (const dup of duplicates) {
        await supabase.from('enrollments').delete().eq('id', dup.id)
        deletedEnrollments.push(dup.id)
      }
    } else if (enrollments && enrollments.length === 1) {
      keptEnrollments.push(enrollments[0])
    }

    // 3. Clean up progress entries
    // Keep only mod-1, mod-2, mod-3, mod-4 (or unique valid module IDs up to 4)
    const { data: progressEntries } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', celeste.id)

    const validModules = new Set(['mod-1', 'mod-2', 'mod-3', 'mod-4'])
    const deletedProgress = []
    const seenModules = new Set()

    if (progressEntries) {
      for (const p of progressEntries) {
        const normalized = p.module_id.replace('modulo-', 'mod-')
        if (!validModules.has(normalized) || seenModules.has(normalized)) {
          await supabase.from('progress').delete().eq('id', p.id)
          deletedProgress.push(p.id)
        } else {
          seenModules.add(normalized)
        }
      }
    }

    return NextResponse.json({
      success: true,
      celeste: { id: celeste.id, name: celeste.name },
      deletedEnrollmentsCount: deletedEnrollments.length,
      deletedProgressCount: deletedProgress.length,
      rawProgressEntries: progressEntries,
      keptEnrollment: keptEnrollments[0] || null,
      currentProgressModules: Array.from(seenModules)
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || String(err) })
  }
}
