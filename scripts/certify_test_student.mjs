import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function certifyStudent() {
  const email = 'student-05@gmail.com';
  const courseKeyword = '%control interno con enfoque en la gestión pública%';

  console.log(`\n🔍 1. Buscando estudiante: ${email}...`);
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('email', email)
    .single();

  if (userErr || !user) {
    console.error('❌ Estudiante no encontrado:', userErr?.message);
    return;
  }
  console.log(`✅ Estudiante encontrado: ${user.name} (${user.id})`);

  console.log(`\n🔍 2. Buscando programa ETDH...`);
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id, title, modules')
    .ilike('title', courseKeyword)
    .single();

  if (courseErr || !course) {
    console.error('❌ Programa no encontrado:', courseErr?.message);
    return;
  }
  console.log(`✅ Programa encontrado: ${course.title} (Módulos: ${course.modules || 1})`);

  console.log(`\n📋 3. Verificando o creando inscripción...`);
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id, group_id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle();

  if (existingEnrollment) {
    await supabase
      .from('enrollments')
      .update({ payment_verified: true })
      .eq('id', existingEnrollment.id);
    console.log(`✅ Inscripción actualizada (pago verificado).`);
  } else {
    const { data: groups } = await supabase
      .from('course_groups')
      .select('id')
      .eq('course_id', course.id)
      .limit(1);

    const groupId = groups && groups.length > 0 ? groups[0].id : null;

    await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: course.id,
        group_id: groupId,
        payment_verified: true,
      });
    console.log(`✅ Nueva inscripción creada con pago verificado.`);
  }

  console.log(`\n🎓 4. Registrando 100% de calificación en todos los módulos...`);
  const numModules = course.modules || 1;
  const moduleKeys = [];
  for (let i = 1; i <= numModules; i++) {
    moduleKeys.push(`mod-${i}`);
    moduleKeys.push(`modulo-${i}`);
  }

  for (const modId of moduleKeys) {
    const { data: existingProg } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .eq('module_id', modId)
      .maybeSingle();

    if (existingProg) {
      await supabase
        .from('progress')
        .update({ score: 100, completed: true, updated_at: new Date().toISOString() })
        .eq('id', existingProg.id);
    } else {
      let uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prog-${user.id}-${modId}`;
      await supabase
        .from('progress')
        .insert({
          id: uuid,
          user_id: user.id,
          course_id: course.id,
          module_id: modId,
          score: 100,
          completed: true,
        });
    }
  }
  console.log(`✅ Módulos aprobados con 100% (5.0).`);

  console.log(`\n📜 5. Generando registros de Certificado y Acta en study_acts...`);
  await supabase
    .from('study_acts')
    .delete()
    .eq('user_id', user.id)
    .eq('course_id', course.id);

  const { error: certErr } = await supabase
    .from('study_acts')
    .insert([
      {
        user_id: user.id,
        course_id: course.id,
        type: 'CERTIFICATE',
      },
      {
        user_id: user.id,
        course_id: course.id,
        type: 'ACTA',
      }
    ]);

  if (certErr) {
    console.error('❌ Error registrando diploma:', certErr.message);
  } else {
    console.log(`✅ Diploma y Acta de grado registrados exitosamente.`);
  }

  console.log(`\n🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!`);
  console.log(`La estudiante ${user.name} (${user.email}) ha quedado 100% aprobada con nota 5.0 (100%).`);
}

certifyStudent().catch(console.error);
