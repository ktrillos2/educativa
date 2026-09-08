import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('1. Buscando a Celeste...');
  const { data: celesteUsers, error: err1 } = await supabase
    .from('users')
    .select('id, name, email')
    .ilike('name', '%celeste%');
  
  if (err1 || !celesteUsers || celesteUsers.length === 0) {
    console.error('No se encontró a Celeste', err1);
    return;
  }
  const celeste = celesteUsers[0];
  console.log(`Celeste encontrada: ${celeste.name} (${celeste.id})`);

  console.log('2. Buscando su inscripción y grupo...');
  const { data: enrollments, error: err2 } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', celeste.id)
    .not('group_id', 'is', null);

  if (err2 || !enrollments || enrollments.length === 0) {
    console.error('Celeste no tiene inscripciones con grupo', err2);
    return;
  }

  const enrollment = enrollments[0];
  const courseId = enrollment.course_id;
  const groupId = enrollment.group_id;
  console.log(`Grupo encontrado: ${groupId} para el curso ${courseId}`);

  console.log('3. Buscando otro estudiante para agregarlo...');
  const { data: otherUsers, error: err3 } = await supabase
    .from('users')
    .select('id, name, email, document')
    .eq('role', 'user')
    .neq('id', celeste.id)
    .limit(1);

  if (err3 || !otherUsers || otherUsers.length === 0) {
    console.error('No se encontró otro usuario', err3);
    return;
  }

  const testUser = otherUsers[0];
  console.log(`Usuario seleccionado para la prueba: ${testUser.name} (${testUser.email}, CC: ${testUser.document})`);

  console.log('4. Inscribiendo al usuario de prueba en el mismo curso y grupo...');
  
  // Revisar si ya está inscrito
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', testUser.id)
    .eq('course_id', courseId)
    .maybeSingle();

  if (existingEnrollment) {
    await supabase.from('enrollments').update({
      group_id: groupId,
      payment_verified: true
    }).eq('id', existingEnrollment.id);
  } else {
    await supabase.from('enrollments').insert({
      user_id: testUser.id,
      course_id: courseId,
      group_id: groupId,
      payment_verified: true
    });
  }

  console.log('5. Aprobando todas las notas del usuario de prueba...');
  // Obtener módulos del curso
  const { data: course } = await supabase.from('courses').select('modules').eq('id', courseId).single();
  const numModules = course.modules;

  for (let i = 1; i <= numModules; i++) {
    const moduleId = `mod-${i}`;
    const { data: existingProgress } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', testUser.id)
      .eq('course_id', courseId)
      .eq('module_id', moduleId)
      .maybeSingle();

    if (existingProgress) {
      await supabase.from('progress').update({ score: 5, completed: true }).eq('id', existingProgress.id);
    } else {
      await supabase.from('progress').insert({
        user_id: testUser.id,
        course_id: courseId,
        module_id: moduleId,
        score: 5,
        completed: true
      });
    }
  }

  console.log('\n--- LISTO PARA LA PRUEBA ---');
  console.log('Puedes probar iniciando sesión con:');
  console.log(`Documento: ${testUser.document}`);
  console.log(`Contraseña: 123456 (o la que hayas definido por defecto)`);
  console.log(`Nombre: ${testUser.name}`);
  console.log('Ya tiene todas las notas en 5.0, el pago verificado y está en el mismo grupo que Celeste.');
  console.log('Una vez inicies sesión, ve al certificado, descárgalo y revisa si en la tabla "study_acts" o donde corresponda se registra correctamente la fecha.');
}

main().catch(console.error);
