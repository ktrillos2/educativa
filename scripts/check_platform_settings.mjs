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

async function checkSettings() {
  console.log('🔍 Consultando platform_settings...');
  const { data, error } = await supabase.from('platform_settings').select('*');
  if (error) {
    console.error('❌ Error en platform_settings:', error.message);
  } else {
    console.log('📋 platform_settings rows:', data);
  }

  console.log('\n🔍 Consultando archivos en storage (info/)...');
  const { data: files, error: filesErr } = await supabase.storage.from('course-modules').list('info');
  if (filesErr) {
    console.error('❌ Error listando info:', filesErr.message);
  } else {
    console.log('📂 Archivos en info/:', files);
  }
}

checkSettings().catch(console.error);
