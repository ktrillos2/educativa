const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const { data: users, error: userError } = await supabase.from('users').select('id, name, document').ilike('name', '%celeste%');
    if (userError || !users || users.length === 0) {
        console.log("User not found");
        return;
    }
    const user = users[0];
    console.log("Found user:", user.name, user.id);

    const { data: enrollments } = await supabase.from('enrollments').select('id, course_id, payment_verified, created_at').eq('user_id', user.id);
    console.log("Enrollments:", enrollments);

    const { data: courses } = await supabase.from('courses').select('id, title, type');
    
    enrollments.forEach(e => {
        const c = courses.find(course => course.id === e.course_id);
        console.log(`- Enrollment ${e.id}: Course ${e.course_id} | Title: ${c ? c.title : 'UNKNOWN'} | Paid: ${e.payment_verified}`);
    });
}
run();
