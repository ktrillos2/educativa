import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const email = 'student-05@gmail.com';
  const courseKeyword = '%control interno con enfoque en la gestión pública%';

  console.log(`\nBuscando al estudiante: ${email}`);
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('email', email)
    .single();

  if (userError || !user) {
    console.error('❌ Estudiante no encontrado:', userError?.message);
    return;
  }
  console.log('✅ Estudiante encontrado:', user.name);

  console.log(`\nBuscando el programa que contenga: "control interno con enfoque en la gestión pública"`);
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title')
    .ilike('title', courseKeyword)
    .single();

  if (courseError || !course) {
    console.error('❌ Programa no encontrado:', courseError?.message);
    return;
  }
  console.log('✅ Programa encontrado:', course.title);

  console.log('\nActualizando el pago (payment_verified = true) en las inscripciones...');
  const { data: enrollment, error: updateError } = await supabase
    .from('enrollments')
    .update({ payment_verified: true })
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .select();

  if (updateError) {
    console.error('❌ Error actualizando el pago:', updateError.message);
  } else if (enrollment && enrollment.length > 0) {
    console.log('🎉 ¡Pago verificado con éxito!');
    console.log(enrollment);
  } else {
    console.error('⚠️ No se encontró la inscripción para este estudiante en este curso (probablemente no está matriculado aún).');
  }
}

main();
