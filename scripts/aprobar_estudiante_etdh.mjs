import { createClient } from "@libsql/client";

const db = createClient({
    url: "file:local.db",
});

async function run() {
    // Buscar directamente a Celeste García
    const enrollments = await db.execute(`
        SELECT u.id, u.name, u.document, e.course_id
        FROM users u
        JOIN enrollments e ON u.id = e.user_id
        WHERE u.name LIKE '%Celeste%' OR u.name LIKE '%Garcia%' OR u.name LIKE '%García%'
        LIMIT 1
    `);

    if (enrollments.rows.length === 0) {
        console.log("❌ No se encontró a Celeste García matriculada en ningún curso.");
        return;
    }

    const user = enrollments.rows[0];
    
    console.log("--------------------------------------------------");
    console.log(`✅ Estudiante encontrado: ${user.name}`);
    console.log(`✅ Documento: ${user.document}`);
    console.log(`✅ ID del Curso (Sanity ID): ${user.course_id}`);
    
    // Módulos que tiene un ETDH
    const modules = ['modulo-1', 'modulo-2', 'modulo-3', 'modulo-4', 'modulo-5', 'modulo-6'];
    
    for (const mod of modules) {
        // Verificar si ya tiene progreso
        const existing = await db.execute({
            sql: `SELECT id FROM progress WHERE user_id = ? AND course_id = ? AND module_id = ?`,
            args: [user.id, user.course_id, mod]
        });
        
        if (existing.rows.length > 0) {
            // Actualizar a 100 y completado
            await db.execute({
                sql: `UPDATE progress SET score = 100, completed = 1 WHERE user_id = ? AND course_id = ? AND module_id = ?`,
                args: [user.id, user.course_id, mod]
            });
        } else {
            // Insertar progreso 100%
            await db.execute({
                sql: `INSERT INTO progress (id, user_id, course_id, module_id, score, completed) VALUES (?, ?, ?, ?, 100, 1)`,
                args: [`prog_${Math.random().toString(36).substring(7)}`, user.id, user.course_id, mod]
            });
        }
    }
    
    console.log("✅ Se ha forzado la aprobación del 100% de todos los módulos de Celeste.");
    console.log("--------------------------------------------------");
    console.log(`🔗 URL para ver su certificado (copia y pega en tu navegador):`);
    console.log(`http://localhost:3000/formacion-academica/${user.course_id}/certificado?document=${user.document}`);
}

run().catch(console.error);
