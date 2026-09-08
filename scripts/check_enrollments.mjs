import { createClient } from "@libsql/client";

const db = createClient({
    url: "file:local.db",
});

async function run() {
    const enrollments = await db.execute(`
        SELECT u.name, u.document, e.course_id
        FROM users u
        JOIN enrollments e ON u.id = e.user_id
    `);

    console.log("Todas las matrículas en la base de datos local:");
    console.table(enrollments.rows);
}

run().catch(console.error);
