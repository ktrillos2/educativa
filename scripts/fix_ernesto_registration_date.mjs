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

async function fixErnestoRegistrationDate() {
  const targetEmail = 'Ernesto@gmail.com';
  const courseKeyword = '%control interno con enfoque en la gestión pública%';

  console.log(`\n🔍 1. Buscando usuario: ${targetEmail}...`);
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('id, name, email')
    .ilike('email', targetEmail)
    .single();

  if (userErr || !user) {
    console.error('❌ Usuario no encontrado:', userErr?.message);
    return;
  }
  console.log(`✅ Usuario encontrado: ${user.name} (${user.id})`);

  console.log(`\n🔍 2. Buscando curso y grupo de Control Interno...`);
  const { data: course } = await supabase
    .from('courses')
    .select('id, title')
    .ilike('title', courseKeyword)
    .single();

  if (!course) {
    console.error('❌ Curso no encontrado');
    return;
  }
  console.log(`✅ Curso: ${course.title} (${course.id})`);

  const { data: groups } = await supabase
    .from('course_groups')
    .select('*')
    .eq('course_id', course.id)
    .order('created_at', { ascending: false });

  console.log(`\n📋 Grupos/Cohortes encontrados para este curso:`);
  console.log(groups);

  const activeGroup = groups && groups.length > 0 ? groups[0] : null;
  
  if (activeGroup) {
    console.log(`\n📅 Rango de inscripción del grupo "${activeGroup.name}":`);
    console.log(`   Inicio: ${activeGroup.registration_start}`);
    console.log(`   Fin (último día): ${activeGroup.registration_end}`);

    // La fecha final de inscripción
    const targetDate = activeGroup.registration_end;

    console.log(`\n✏️ 3. Actualizando fecha de inscripción de Ernesto a la fecha final de inscripción (${targetDate})...`);
    
    // Asegurar que group_id esté asignado y la fecha created_at sea la fecha límite de inscripción
    const { error: updateErr } = await supabase
      .from('enrollments')
      .update({
        created_at: targetDate,
        group_id: activeGroup.id,
        payment_verified: true
      })
      .eq('user_id', user.id)
      .eq('course_id', course.id);

    if (updateErr) {
      console.error('❌ Error actualizando inscripción:', updateErr.message);
    } else {
      console.log(`✅ Inscripción de Ernesto actualizada correctamente con la fecha de inscripción: ${targetDate}`);
    }

    // Además, para todos los estudiantes de este curso que tengan group_id null, asignarles este group_id
    const { data: updatedLegacy, error: legacyErr } = await supabase
      .from('enrollments')
      .update({ group_id: activeGroup.id })
      .eq('course_id', course.id)
      .is('group_id', null);

    if (!legacyErr) {
      console.log(`✅ Se vincularon automáticamente todas las inscripciones históricas del curso al grupo ${activeGroup.name}`);
    }
  } else {
    console.log('⚠️ No se encontró ningún grupo para este curso.');
  }
}

fixErnestoRegistrationDate().catch(console.error);
