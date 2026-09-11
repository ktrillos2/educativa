import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: courses, error } = await supabaseAdmin.from('courses').select('*');
  const result = {
    error,
    count: courses ? courses.length : 0,
    courses: courses || []
  };
  fs.writeFileSync(
    path.resolve(process.cwd(), 'scripts', 'courses_output.json'),
    JSON.stringify(result, null, 2)
  );
  console.log("Written courses output to scripts/courses_output.json");
}

main().catch(console.error);
