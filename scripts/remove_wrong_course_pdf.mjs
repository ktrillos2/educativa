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

async function removeWrongCoursePdf() {
  const courseId = 'gestion-presupuesto-publico';
  console.log(`🔍 Eliminando asignación errónea de PDF del curso para: ${courseId}...`);

  const keysToDelete = [
    `course_pdf_${courseId}`,
    `course_info_${courseId}`,
  ];

  const { error } = await supabase
    .from('platform_settings')
    .delete()
    .in('key', keysToDelete);

  if (error) {
    console.error('❌ Error al eliminar en platform_settings:', error.message);
  } else {
    console.log(`✅ Asignación errónea eliminada de platform_settings exitosamente.`);
  }
}

removeWrongCoursePdf().catch(console.error);
