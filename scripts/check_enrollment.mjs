import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: user } = await supabase.from('users').select('id, name').eq('email', 'student-05@gmail.com').single();
  if (user) {
    const { data: enrollments } = await supabase.from('enrollments').select('*, courses(title)').eq('user_id', user.id);
    console.log(JSON.stringify(enrollments, null, 2));
  }
}
check();
