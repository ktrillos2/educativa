import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabaseAnon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  console.log("--- Testing Admin Client ---");
  const { data: allCoursesAdmin, error: err1 } = await supabaseAdmin.from('courses').select('id, title, type, category');
  console.log("All courses (admin):", allCoursesAdmin, "Error:", err1);

  const { data: dipAdmin, error: err2 } = await supabaseAdmin
    .from("courses")
    .select("*")
    .or("type.eq.diplomado,type.is.null");
  console.log("Diplomados (admin):", dipAdmin?.length, "Error:", err2);

  console.log("\n--- Testing Anon Client ---");
  const { data: allCoursesAnon, error: err3 } = await supabaseAnon.from('courses').select('id, title, type, category');
  console.log("All courses (anon):", allCoursesAnon?.length, "Error:", err3);

  const { data: dipAnon, error: err4 } = await supabaseAnon
    .from("courses")
    .select("*")
    .or("type.eq.diplomado,type.is.null");
  console.log("Diplomados (anon):", dipAnon?.length, "Error:", err4);
}

main().catch(console.error);
