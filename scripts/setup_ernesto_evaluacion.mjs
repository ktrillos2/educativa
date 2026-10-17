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

async function setupErnesto() {
  const targetEmail = 'Ernesto@gmail.com';
  const courseKeyword = '%control interno con enfoque en la gestión pública%';

  console.log(`\n======================================================`);
  console.log(`🚀 PREPARANDO ESTUDIANTE ERNESTO RUIZ PARA PRUEBAS`);
  console.log(`======================================================\n`);

  // 1. Buscar a Ernesto
  console.log(`🔍 1. Buscando usuario: ${targetEmail}...`);
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('id, name, email')
    .ilike('email', targetEmail)
    .maybeSingle();

  if (userErr || !user) {
    console.error('❌ Estudiante no encontrado con email:', targetEmail);
    console.error('Asegúrate de que el usuario esté registrado en la plataforma.');
    return;
  }
  console.log(`✅ Estudiante: ${user.name} (${user.email}, ID: ${user.id})`);

  // 2. Buscar el programa
  console.log(`\n🔍 2. Buscando programa ETDH: "Control interno"...`);
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id, title, modules')
    .ilike('title', courseKeyword)
    .single();

  if (courseErr || !course) {
    console.error('❌ Programa no encontrado:', courseErr?.message);
    return;
  }
  console.log(`✅ Programa: ${course.title} (ID: ${course.id})`);

  // 3. Matrícula y Pago verificado
  console.log(`\n📋 3. Verificando matrícula y pago...`);
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id, payment_verified')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle();

  if (existingEnrollment) {
    await supabase
      .from('enrollments')
      .update({ payment_verified: true })
      .eq('id', existingEnrollment.id);
    console.log(`✅ Matrícula actualizada: Pago verificado (payment_verified = true).`);
  } else {
    await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: course.id,
        payment_verified: true,
      });
    console.log(`✅ Nueva matrícula creada con pago verificado.`);
  }

  // 4. Aprobar 100% de módulos y evaluaciones
  const numModules = course.modules || 10;
  console.log(`\n🎓 4. Aprobando al 100% los ${numModules} módulos y evaluaciones...`);

  const moduleKeys = new Set();
  for (let i = 1; i <= Math.max(numModules, 10); i++) {
    moduleKeys.add(`mod-${i}`);
    moduleKeys.add(`modulo-${i}`);
    moduleKeys.add(`${i}`);
  }

  for (const modId of Array.from(moduleKeys)) {
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
        .update({
          score: 100,
          completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProg.id);
    } else {
      const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prog-${user.id}-${modId}`;
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
  console.log(`✅ Todos los módulos y cuestionarios aprobados con 100% (5.0).`);

  // 5. Reiniciar autoevaluación previa para prueba limpia (opcional)
  try {
    const { error: delErr } = await supabase
      .from('auto_evaluation_responses')
      .delete()
      .eq('user_id', user.id)
      .eq('program_id', course.id);

    if (!delErr) {
      console.log(`\n🔄 5. Autoevaluación previa reiniciada (para que puedas diligenciarla desde cero en la prueba).`);
    }
  } catch (e) {
    // Si la tabla no existe aún, se ignora
  }

  console.log(`\n======================================================`);
  console.log(`🎉 ¡LISTO! ERNESTO RUIZ ESTÁ 100% PREPARADO PARA PROBAR`);
  console.log(`======================================================`);
  console.log(`\n📌 Rutas para la prueba:`);
  console.log(`1. Página del programa: http://localhost:3000/formacion-academica/${course.id}`);
  console.log(`2. Intentar ver certificado: http://localhost:3000/formacion-academica/${course.id}/certificado`);
  console.log(`   👉 Verás el aviso que te exige diligenciar la Autoevaluación.`);
  console.log(`3. Formulario de autoevaluación: http://localhost:3000/formacion-academica/${course.id}/auto-evaluacion`);
  console.log(`   👉 Diligencia y envía el formulario.`);
  console.log(`4. Panel Admin (solo admin): http://localhost:3000/admin/auto-evaluacion`);
  console.log(`   👉 Verás reflejadas las respuestas y calificaciones de Ernesto.`);
  console.log(`\n`);
  process.exit(0);
}

setupErnesto().catch((err) => {
  console.error('Error ejecutando setup:', err);
  process.exit(1);
});
