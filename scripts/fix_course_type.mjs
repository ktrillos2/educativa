import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log("⏳ Cambiando el tipo del curso 9 a 'etdh'...");

  const { error } = await supabase
    .from('courses')
    .update({ type: 'etdh' })
    .eq('id', '9');

  if (error) {
    console.error("❌ Error al actualizar el curso:", error);
  } else {
    console.log("✅ Curso 9 actualizado correctamente a tipo 'etdh'.");
    console.log("👉 Ahora el sistema sí le aplicará todas las reglas de expiración de cohortes de 5 días.");
  }
}

main().catch(console.error);
