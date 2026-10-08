import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function enroll() {
  const email = 'student-05@gmail.com';
  const courseKeyword = '%control interno con enfoque en la gestión pública%';

  // 1. Encontrar el usuario
  const { data: user } = await supabase.from('users').select('id').eq('email', email).single();
  if (!user) {
    console.error('Estudiante no encontrado');
    return;
  }

  // 2. Encontrar el curso
  const { data: course } = await supabase.from('courses').select('id, title').ilike('title', courseKeyword).single();
  if (!course) {
    console.error('Curso no encontrado');
    return;
  }

  // 3. Verificar si ya existe inscripción o crearla
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id, payment_verified')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('enrollments')
      .update({ payment_verified: true })
      .eq('id', existing.id)
      .select('id, user_id, course_id, payment_verified');

    if (error) {
      console.error('Error actualizando pago:', error.message);
    } else {
      console.log('¡Pago actualizado y verificado exitosamente!');
      console.log(data);
    }
  } else {
    const { data, error } = await supabase.from('enrollments').insert({
      user_id: user.id,
      course_id: course.id,
      payment_verified: true
    }).select('id, user_id, course_id, payment_verified');

    if (error) {
      console.error('Error creando inscripción:', error.message);
    } else {
      console.log('¡Inscripción creada y pago verificado exitosamente!');
      console.log(data);
    }
  }
}

enroll();
