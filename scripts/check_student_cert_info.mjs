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

async function checkStudentCertInfo() {
  const courseKeyword = '%control interno con enfoque en la gestión pública%';

  const { data: course } = await supabase
    .from('courses')
    .select('id, title')
    .ilike('title', courseKeyword)
    .single();

  if (!course) {
    console.error('❌ Curso no encontrado');
    return;
  }
  console.log(`\n📌 Curso: ${course.title} (${course.id})`);

  // Obtener inscripciones ordenadas por fecha de creación (creación cronológica)
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, user_id, created_at, group_id, payment_verified, users(id, name, email, document)')
    .eq('course_id', course.id)
    .order('created_at', { ascending: true });

  console.log(`\n📋 Inscripciones encontradas (${enrollments?.length || 0}):`);
  
  const userIds = (enrollments || []).map(e => e.user_id);

  const { data: studyActs } = await supabase
    .from('study_acts')
    .select('*')
    .eq('course_id', course.id)
    .in('user_id', userIds.length > 0 ? userIds : ['none']);

  console.log(`\n📜 Registros de study_acts (${studyActs?.length || 0}):`);

  (enrollments || []).forEach((enroll, idx) => {
    const user = enroll.users;
    const acts = (studyActs || []).filter(a => a.user_id === enroll.user_id);
    const certAct = acts.find(a => a.type === 'CERTIFICATE' || a.type === 'DIPLOMA');
    const actaAct = acts.find(a => a.type === 'ACTA');

    const seqActa = String(idx + 1).padStart(5, '0');
    const currentYear = new Date().getFullYear();
    const registroActa = certAct ? `${currentYear}-${seqActa}` : 'N/A';

    console.log(`\n----------------------------------------`);
    console.log(`Estudiante #${idx + 1}: ${user?.name} (${user?.email})`);
    console.log(`- Fecha de inscripción (created_at): ${enroll.created_at}`);
    console.log(`- N° Registro / Acta calculado: ${registroActa}`);
    console.log(`- Registro Certificado (study_acts): ${certAct ? certAct.created_at : 'No tiene'}`);
    console.log(`- Registro Acta (study_acts): ${actaAct ? actaAct.created_at : 'No tiene'}`);
  });
}

checkStudentCertInfo().catch(console.error);
