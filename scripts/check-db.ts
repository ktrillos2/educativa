import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function check() {
  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
  console.log('Total Users in DB:', usersCount)

  const { data: enrollments } = await supabase.from('enrollments').select('*')
  console.log('Total Enrollments in DB:', enrollments?.length)
  
  if (enrollments && enrollments.length > 0) {
      const countsByCourse = enrollments.reduce((acc: any, curr: any) => {
          acc[curr.course_id] = (acc[curr.course_id] || 0) + 1;
          return acc;
      }, {});
      console.log('Enrollments by course_id:', countsByCourse);
  }
}

check()
