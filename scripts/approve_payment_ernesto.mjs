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

async function approvePayment() {
  const targetEmail = 'Ernesto@gmail.com';
  const courseKeyword = '%control interno con enfoque en la gestión pública%';

  console.log(`\n🔍 1. Buscando estudiante: ${targetEmail}...`);
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('id, name, email')
    .ilike('email', targetEmail)
    .maybeSingle();

  if (userErr || !user) {
    console.error('❌ Estudiante no encontrado:', userErr?.message || 'sin resultados');
    return;
  }
  console.log(`✅ Estudiante encontrado: ${user.name} (${user.email}, ID: ${user.id})`);

  console.log(`\n🔍 2. Buscando programa ETDH: "Control interno con enfoque en la gestión pública"...`);
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id, title')
    .ilike('title', courseKeyword)
    .single();

  if (courseErr || !course) {
    console.error('❌ Programa no encontrado:', courseErr?.message);
    return;
  }
  console.log(`✅ Programa encontrado: ${course.title} (ID: ${course.id})`);

  console.log(`\n📋 3. Verificando o creando inscripción para este programa...`);
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id, payment_verified, group_id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle();

  if (existingEnrollment) {
    const { error: updateErr } = await supabase
      .from('enrollments')
      .update({ payment_verified: true })
      .eq('id', existingEnrollment.id);

    if (updateErr) {
      console.error('❌ Error actualizando inscripción:', updateErr.message);
    } else {
      console.log(`✅ Inscripción existente actualizada a PAGO VERIFICADO (ID: ${existingEnrollment.id}).`);
    }
  } else {
    // Buscar si existe un cohorte para este curso
    const { data: groups } = await supabase
      .from('course_groups')
      .select('id')
      .eq('course_id', course.id)
      .limit(1);

    const groupId = groups && groups.length > 0 ? groups[0].id : null;

    const { data: newEnroll, error: insertErr } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: course.id,
        group_id: groupId,
        payment_verified: true,
      })
      .select('id');

    if (insertErr) {
      console.error('❌ Error creando nueva inscripción:', insertErr.message);
    } else {
      console.log(`✅ Nueva inscripción creada con PAGO VERIFICADO.`);
    }
  }

  console.log(`\n🎉 ¡PROCESO COMPLETADO! Ernesto Ruiz (${user.email}) ya tiene acceso con pago verificado a:`);
  console.log(`   "${course.title}"`);
}

approvePayment().catch(console.error);
