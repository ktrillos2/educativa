import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const COURSE_ID = 'Seguridad social';
const NUM_STUDENTS = 14;

// Datos ficticios para los 14 estudiantes de prueba
const TEST_STUDENTS = Array.from({ length: NUM_STUDENTS }, (_, i) => ({
  name: `Estudiante Prueba ${i + 1}`,
  email: `test.seg.social.${i + 1}@prueba.edu.co`,
  document: `10000${String(i + 1).padStart(4, '0')}`,
  phone: `30000${String(i + 1).padStart(5, '0')}`,
  role: 'user',
  password_hash: 'test-hash',
}));

async function main() {
  console.log(`\n🎓 Buscando curso con nombre similar a "Seguridad social"...\n`);

  // 1. Verificar que el curso existe (búsqueda flexible por si el ID o nombre varió)
  const { data: courses, error: courseErr } = await supabase
    .from('courses')
    .select('id, title, modules, students')
    .ilike('id', '%Seguridad social%');

  const course = courses && courses.length > 0 ? courses[0] : null;
  const actualCourseId = course ? course.id : null;

  if (courseErr || !course || !actualCourseId) {
    console.error('❌ Curso no encontrado. Verifica la base de datos.');
    process.exit(1);
  }

  console.log(`✅ Curso encontrado: "${course.title}" (${course.modules} módulos, ${course.students})`);
  console.log(`   ID real en base de datos: "${actualCourseId}"\n`);

  let created = 0;
  let skipped = 0;

  for (const student of TEST_STUDENTS) {
    // 2. Verificar si ya existe un usuario con ese documento
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, name')
      .eq('document', student.document)
      .maybeSingle();

    let userId;

    if (existingUser) {
      userId = existingUser.id;
      console.log(`  ↩️  Usuario ya existe: ${existingUser.name} (${student.document})`);
    } else {
      // 3. Crear el usuario en auth de Supabase
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: student.email,
        password: '123456',
        email_confirm: true,
        user_metadata: { name: student.name },
      });

      if (authErr || !authData?.user) {
        console.error(`  ❌ Error creando auth para ${student.name}:`, authErr?.message);
        skipped++;
        continue;
      }

      userId = authData.user.id;

      // 4. Crear el perfil en la tabla users
      const { error: profileErr } = await supabase.from('users').insert({
        id: userId,
        name: student.name,
        email: student.email,
        document: student.document,
        phone: student.phone,
        role: 'user',
      });

      if (profileErr) {
        console.error(`  ❌ Error creando perfil para ${student.name}:`, profileErr.message);
        skipped++;
        continue;
      }

      console.log(`  ✅ Usuario creado: ${student.name} (${student.email})`);
    }

    // 5. Verificar inscripción existente
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', actualCourseId)
      .maybeSingle();

    if (existingEnrollment) {
      // Actualizar pago
      await supabase
        .from('enrollments')
        .update({ payment_verified: true })
        .eq('id', existingEnrollment.id);
      console.log(`     💳 Inscripción ya existía — pago verificado`);
    } else {
      // Crear inscripción con pago verificado
      const { error: enrollErr } = await supabase.from('enrollments').insert({
        user_id: userId,
        course_id: actualCourseId,
        payment_verified: true,
      });

      if (enrollErr) {
        console.error(`     ❌ Error inscribiendo a ${student.name}:`, enrollErr.message);
        skipped++;
        continue;
      }
      console.log(`     💳 Inscrito y pago verificado`);
    }

    created++;
  }

  // 6. Contar inscritos totales
  const { count } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', actualCourseId);

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Proceso completado:`);
  console.log(`   • Estudiantes procesados: ${created}`);
  console.log(`   • Omitidos por error:     ${skipped}`);
  console.log(`   • Total inscritos en BD:  ${count}`);
  console.log(`\n💡 Todos los usuarios tienen contraseña: 123456`);
  console.log(`   Pueden iniciar sesión con su email (test.seg.social.N@prueba.edu.co)\n`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
