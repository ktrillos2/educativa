import { createClient } from "@libsql/client";

const db = createClient({
    url: "file:local.db",
});

async function run() {
    // Find a student who is enrolled in ETDH
    const enrollments = await db.execute(`
        SELECT u.id, u.name, u.document, e.course_id
        FROM users u
        JOIN enrollments e ON u.id = e.user_id
        WHERE e.course_id LIKE '%etdh%' OR e.course_id LIKE '%formacion%' OR e.course_id = 'auxiliar-sistemas' OR e.course_id = 'atencion-integral'
        LIMIT 10
    `);

    console.log("Students in ETDH:");
    console.table(enrollments.rows);
    
    // Check their progress
    if (enrollments.rows.length > 0) {
        for (const user of enrollments.rows) {
            const progress = await db.execute({
                sql: `SELECT module_id, score, completed FROM progress WHERE user_id = ? AND course_id = ?`,
                args: [user.id, user.course_id]
            });
            console.log(`\nProgress for ${user.name} (${user.course_id}):`);
            console.table(progress.rows);
        }
    }
}
run();
