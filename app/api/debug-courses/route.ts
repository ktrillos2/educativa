import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient()
    const { data: courses, error } = await supabaseAdmin.from('courses').select('*')
    return NextResponse.json({
      success: true,
      count: courses ? courses.length : 0,
      error,
      courses
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || String(err)
    })
  }
}
