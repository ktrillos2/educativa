import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: celesteUsers, error: err1 } = await supabase
    .from('users')
    .select('id, name')
    .ilike('name', '%celeste%');
  
  if (err1 || !celesteUsers || celesteUsers.length === 0) {
    console.error('No se encontró a Celeste', err1);
    return;
  }
  const celeste = celesteUsers[0];
  
  const { data: acts, error: err2 } = await supabase
    .from('study_acts')
    .select('*')
    .eq('user_id', celeste.id);

  if (err2 || !acts || acts.length === 0) {
    console.log(`Celeste (${celeste.name}) no tiene registros en study_acts.`);
    return;
  }

  console.log(`Registros en study_acts para ${celeste.name}:`);
  acts.forEach(act => {
    console.log(act);
  });
}

main().catch(console.error);
