import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("⏳ Reiniciando la prueba de expiración...");

  // 1. Buscar a Eliana y Celeste
  const { data: users } = await supabase
    .from('users')
    .select('id, name, role')
    .or('name.ilike.%Celeste%,name.ilike.%Eliana%');

  const celeste = users.find(u => u.name.toLowerCase().includes('celeste'));
  const eliana = users.find(u => u.name.toLowerCase().includes('eliana'));

  console.log(`- Rol de Eliana en base de datos: ${eliana.role}`);

  // 2. Buscar inscripciones
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, group_id')
    .in('user_id', [celeste.id, eliana.id]);

  let courseId = null;
  let groupId = null;
  for (const e of enrollments) {
      if (e.group_id) {
          courseId = e.course_id;
          groupId = e.group_id;
          break;
      }
  }

  // 3. Modificar la fecha de primera descarga a hace 6 días
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  
  await supabase
    .from('course_groups')
    .update({ first_certificate_download_at: sixDaysAgo.toISOString() })
    .eq('id', groupId);

  console.log(`✅ Cohorte cerrado: configurado a hace 6 días.`);

  // 4. Limpiar descargas de Eliana (porque le dio click antes y se volvió a guardar)
  await supabase
    .from('study_acts')
    .delete()
    .eq('user_id', eliana.id)
    .eq('course_id', courseId)
    .eq('type', 'CERTIFICATE');
    
  console.log(`✅ Registro de descargas de Eliana eliminado (Reiniciado).`);

  // --- DIAGNÓSTICO EXACTO DEL CÓDIGO ---
  console.log("\n🔍 DIAGNÓSTICO DE LA LÓGICA DE EXPIRACIÓN (Simulando lo que ve Eliana):");
  
  const { data: enrollmentTest, error } = await supabase
    .from("enrollments")
    .select("id, payment_verified, course_groups(first_certificate_download_at)")
    .eq("user_id", eliana.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) {
    console.log("❌ Error en la query:", error);
  } else {
    console.log("- Datos obtenidos de enrollment:", JSON.stringify(enrollmentTest));
    
    let certificateExpired = false;
    const isAdmin = eliana.role === 'admin';
    
    if (enrollmentTest?.course_groups && !isAdmin) {
      const groupData = Array.isArray(enrollmentTest.course_groups) ? enrollmentTest.course_groups[0] : enrollmentTest.course_groups;
      console.log("- Datos del grupo:", JSON.stringify(groupData));
      
      if (groupData?.first_certificate_download_at) {
          const firstDownloadDate = new Date(groupData.first_certificate_download_at);
          const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
          const diff = Date.now() - firstDownloadDate.getTime();
          console.log(`- Diferencia de tiempo: ${diff}ms (5 días son ${fiveDaysMs}ms)`);
          
          if (diff > fiveDaysMs) {
              certificateExpired = true;
          }
      }
    } else {
      if (isAdmin) console.log("⚠️ Eliana es ADMIN, por lo tanto el bloqueo se ignora automáticamente.");
      if (!enrollmentTest?.course_groups) console.log("⚠️ No se obtuvieron datos de course_groups.");
    }
    
    console.log(`👉 ¿Resultado final del bloqueo (certificateExpired)?: ${certificateExpired ? "BLOQUEADO 🔴" : "PERMITIDO 🟢"}`);
  }
}

main().catch(console.error);
