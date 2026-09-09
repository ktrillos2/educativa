import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, type')
    .eq('id', '9')
    .maybeSingle();

  console.log("Course 9 details:", course);
}

main().catch(console.error);
