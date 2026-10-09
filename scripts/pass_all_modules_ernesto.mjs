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

async function passErnestoCourse() {
  const targetEmail = 'Ernesto@gmail.com';
  const courseKeyword = '%control interno con enfoque en la gestión pública%';

  console.log(`\n🔍 1. Buscando usuario: ${targetEmail}...`);
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('id, name, email')
    .ilike('email', targetEmail)
    .single();

  if (userErr || !user) {
    console.error('❌ Estudiante no encontrado:', userErr?.message);
    return;
  }
  console.log(`✅ Estudiante encontrado: ${user.name} (${user.id})`);

  console.log(`\n🔍 2. Buscando curso de Control Interno...`);
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('*')
    .ilike('title', courseKeyword)
    .single();

  if (courseErr || !course) {
    console.error('❌ Curso no encontrado:', courseErr?.message);
    return;
  }
  console.log(`✅ Curso encontrado: ${course.title} (ID: ${course.id})`);

  const numModules = course.modules || 10;
  console.log(`\n🎓 3. Registrando 100% de aprobación en los ${numModules} módulos del programa...`);

  // Construir identificadores de módulos posibles (mod-1, mod-2, modulo-1, modulo-2, 1, 2, etc.)
  const moduleKeys = new Set();
  for (let i = 1; i <= Math.max(numModules, 10); i++) {
    moduleKeys.add(`mod-${i}`);
    moduleKeys.add(`modulo-${i}`);
    moduleKeys.add(`${i}`);
  }

  // Si el curso tiene un temario/syllabus estructurado
  if (Array.isArray(course.syllabus)) {
    course.syllabus.forEach((s, idx) => {
      if (s.id) moduleKeys.add(String(s.id));
      moduleKeys.add(`mod-${idx + 1}`);
    });
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
          updated_at: new Date().toISOString()
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
  console.log(`✅ Todos los módulos y evaluaciones marcadas con 100% (5.0) para Ernesto.`);

  console.log(`\n📜 4. Registrando diploma y acta de grado en study_acts...`);
  const { data: existingActs } = await supabase
    .from('study_acts')
    .select('id, type')
    .eq('user_id', user.id)
    .eq('course_id', course.id);

  const hasCert = existingActs?.some(a => a.type === 'CERTIFICATE' || a.type === 'DIPLOMA');
  const hasActa = existingActs?.some(a => a.type === 'ACTA');

  const actsToInsert = [];
  if (!hasCert) {
    actsToInsert.push({
      user_id: user.id,
      course_id: course.id,
      type: 'CERTIFICATE',
    });
  }
  if (!hasActa) {
    actsToInsert.push({
      user_id: user.id,
      course_id: course.id,
      type: 'ACTA',
    });
  }

  if (actsToInsert.length > 0) {
    const { error: certErr } = await supabase
      .from('study_acts')
      .insert(actsToInsert);

    if (certErr) {
      console.error('❌ Error registrando actas/diploma:', certErr.message);
    } else {
      console.log(`✅ Registro de Certificado y Acta creado exitosamente.`);
    }
  } else {
    console.log(`✅ El estudiante ya contaba con registros en study_acts.`);
  }

  console.log(`\n🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!`);
  console.log(`Estudiante: ${user.name} (${user.email})`);
  console.log(`Programa: "${course.title}"`);
  console.log(`Estado: Todos los módulos y evaluaciones marcadas como APROBADAS (100% - Nota 5.0).`);
}

passErnestoCourse().catch(console.error);
