import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * API route to receive auto‑evaluation answers from students.
 * Expected payload:
 *   {
 *     programId: string,
 *     answers: Record<string, number>
 *   }
 * The handler inserts a row into the `auto_evaluation_responses` table.
 * The table should have columns: id (uuid), program_id (text), user_id (text),
 * answers (jsonb), created_at (timestamp).
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const { programId, answers } = await request.json();
  if (!programId || !answers) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('auto_evaluation_responses')
    .insert({
      program_id: programId,
      user_id: session.userId,
      answers: answers,
    })
    .single();

  if (error) {
    console.error('Error inserting auto‑evaluation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, record: data });
}
