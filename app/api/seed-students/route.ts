import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const NUM_STUDENTS = 14;

    const TEST_STUDENTS = Array.from({ length: NUM_STUDENTS }, (_, i) => ({
      name: `Estudiante Prueba ${i + 1}`,
      email: `test.seg.social.${i + 1}@prueba.edu.co`,
      document: `10000${String(i + 1).padStart(4, '0')}`,
      phone: `30000${String(i + 1).padStart(5, '0')}`,
      role: 'user',
      password_hash: 'test-hash',
    }));

    const actualCourseId = "seguridad-social"; // ID exacto del diplomado de Seguridad Social según la base de datos

    const { data: course, error: courseErr } = await supabase
      .from('courses')
      .select('id, title, modules, students')
      .eq('id', actualCourseId)
      .single();

    if (courseErr || !course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    let created = 0;
    let skipped = 0;
    const logs = [];

    logs.push(`✅ Curso encontrado: "${course.title}" (ID: ${actualCourseId})`);

    for (const student of TEST_STUDENTS) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, name')
        .eq('document', student.document)
        .maybeSingle();

      let userId;

      if (existingUser) {
        userId = existingUser.id;
        logs.push(`↩️  Usuario ya existe: ${existingUser.name} (${student.document})`);
      } else {
        const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
          email: student.email,
          password: '123456',
          email_confirm: true,
          user_metadata: { name: student.name },
        });

        if (authErr || !authData?.user) {
          skipped++;
          continue;
        }

        userId = authData.user.id;

        await supabase.from('users').insert({
          id: userId,
          name: student.name,
          email: student.email,
          document: student.document,
          phone: student.phone,
          role: 'user',
        });
      }

      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', actualCourseId)
        .maybeSingle();

      if (existingEnrollment) {
        await supabase
          .from('enrollments')
          .update({ payment_verified: true })
          .eq('id', existingEnrollment.id);
        logs.push(`💳 Inscripción actualizada: ${student.name}`);
      } else {
        await supabase.from('enrollments').insert({
          user_id: userId,
          course_id: actualCourseId,
          payment_verified: true,
        });
        logs.push(`💳 Nuevo inscrito: ${student.name}`);
      }

      created++;
    }

    const { count } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', actualCourseId);

    return NextResponse.json({
      success: true,
      message: `Proceso completado. ${created} estudiantes procesados.`,
      totalInscritos: count,
      logs
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
