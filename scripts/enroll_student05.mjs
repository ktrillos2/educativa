import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TARGET_EMAIL = 'student-05@gmail.com';
const COURSE_KEYWORD = 'presupuesto'; // búsqueda insensible a mayúsculas

async function main() {
  console.log(`\n🔍 1. Buscando usuario con email: ${TARGET_EMAIL}`);
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, email')
    .ilike('email', TARGET_EMAIL)
    .maybeSingle();

  if (userError || !user) {
    console.error('❌ Usuario no encontrado:', userError?.message || 'sin resultados');
    process.exit(1);
  }
  console.log(`✅ Usuario encontrado: ${user.name} (ID: ${user.id})`);

  console.log(`\n🔍 2. Buscando diplomado que contenga "${COURSE_KEYWORD}"...`);
  const { data: courses, error: courseError } = await supabase
    .from('courses')
    .select('id, title, modules')
    .ilike('title', `%${COURSE_KEYWORD}%`);

  if (courseError || !courses || courses.length === 0) {
    console.error('❌ Curso no encontrado:', courseError?.message || 'sin resultados');
    process.exit(1);
  }

  if (courses.length > 1) {
    console.log('⚠️  Se encontraron varios cursos:');
    courses.forEach((c, i) => console.log(`   ${i + 1}. [${c.id}] ${c.title}`));
  }

  const course = courses[0];
  console.log(`✅ Curso seleccionado: [${course.id}] ${course.title} (${course.modules} módulos)`);

  console.log(`\n📋 3. Verificando inscripción existente...`);
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id, payment_verified')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle();

  if (existingEnrollment) {
    console.log(`   Ya tiene inscripción (ID: ${existingEnrollment.id}). Actualizando pago...`);
    const { error: updateErr } = await supabase
      .from('enrollments')
      .update({ payment_verified: true })
      .eq('id', existingEnrollment.id);

    if (updateErr) {
      console.error('❌ Error actualizando inscripción:', updateErr.message);
      process.exit(1);
    }
    console.log(`✅ Pago verificado correctamente.`);
  } else {
    console.log(`   No tiene inscripción. Creando nueva...`);
    const { error: insertErr } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: course.id,
        payment_verified: true,
      });

    if (insertErr) {
      console.error('❌ Error creando inscripción:', insertErr.message);
      process.exit(1);
    }
    console.log(`✅ Inscripción creada con pago verificado.`);
  }

  console.log(`\n🎉 LISTO — ${user.name} (${user.email}) tiene acceso al curso:`);
  console.log(`   "${course.title}"`);
}

main().catch(console.error);
