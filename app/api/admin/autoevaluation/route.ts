import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * POST: Guarda la respuesta de autoevaluación enviada por el estudiante.
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { programId, answers } = await request.json();
    if (!programId || !answers) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Guardar o actualizar la respuesta del estudiante para este programa
    const { data: existing } = await supabase
      .from('auto_evaluation_responses')
      .select('id')
      .eq('program_id', programId)
      .eq('user_id', session.userId)
      .maybeSingle();

    let result;
    if (existing) {
      result = await supabase
        .from('auto_evaluation_responses')
        .update({
          answers,
          created_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('auto_evaluation_responses')
        .insert({
          program_id: programId,
          user_id: session.userId,
          answers: answers,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error insertando/actualizando autoevaluación:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, record: result.data });
  } catch (err: any) {
    console.error('Error en POST autoevaluación:', err);
    return NextResponse.json({ error: err.message || 'Error del servidor' }, { status: 500 });
  }
}

/**
 * GET: Obtiene las respuestas de autoevaluación (solo admin).
 */
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (session?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado: solo administradores' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    const supabase = createAdminClient();

    let query = supabase
      .from('auto_evaluation_responses')
      .select(`
        id,
        program_id,
        user_id,
        answers,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (programId) {
      query = query.eq('program_id', programId);
    }

    const { data: responses, error } = await query;

    if (error) {
      console.error('Error obteniendo autoevaluaciones:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Obtener nombres de usuarios y cursos para enriquecer la tabla
    const userIds = Array.from(new Set(responses?.map((r) => r.user_id) || []));
    const courseIds = Array.from(new Set(responses?.map((r) => r.program_id) || []));

    const [{ data: users }, { data: courses }] = await Promise.all([
      userIds.length > 0
        ? supabase.from('users').select('id, name, email, document').in('id', userIds)
        : Promise.resolve({ data: [] }),
      courseIds.length > 0
        ? supabase.from('courses').select('id, title').in('id', courseIds)
        : Promise.resolve({ data: [] })
    ]);

    const userMap = new Map((users || []).map((u) => [u.id, u]));
    const courseMap = new Map((courses || []).map((c) => [c.id, c]));

    const enriched = (responses || []).map((r) => ({
      ...r,
      user: userMap.get(r.user_id) || { name: 'Desconocido', email: '', document: '' },
      course: courseMap.get(r.program_id) || { title: r.program_id }
    }));

    return NextResponse.json({ responses: enriched });
  } catch (err: any) {
    console.error('Error en GET autoevaluación:', err);
    return NextResponse.json({ error: err.message || 'Error del servidor' }, { status: 500 });
  }
}

