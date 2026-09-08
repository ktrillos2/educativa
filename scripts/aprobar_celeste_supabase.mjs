import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Admin key

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    // 1. Buscar a Celeste García
    const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, name, document")
        .ilike("name", "%Celeste%");

    if (userError) throw userError;
    
    if (!users || users.length === 0) {
        console.log("❌ No se encontró ninguna estudiante llamada Celeste en Supabase.");
        return;
    }

    const celeste = users[0];
    console.log(`✅ Estudiante encontrada: ${celeste.name} (Doc: ${celeste.document})`);

    // 2. Buscar su matrícula en un curso ETDH o cualquier curso que tenga
    const { data: enrollments, error: enrollError } = await supabase
        .from("enrollments")
        .select("id, course_id, payment_verified")
        .eq("user_id", celeste.id)
        .limit(1);

    if (enrollError) throw enrollError;

    if (!enrollments || enrollments.length === 0) {
        console.log("❌ Celeste no está matriculada en ningún curso en Supabase.");
        console.log("Debes registrarla en un curso primero desde la plataforma.");
        return;
    }

    const enrollment = enrollments[0];
    const courseId = enrollment.course_id;
    console.log(`✅ Matriculada en el curso: ${courseId}`);

    // Asegurarse de que el pago esté verificado para que le deje ver el certificado
    if (!enrollment.payment_verified) {
        console.log(`✅ Actualizando payment_verified a true...`);
        await supabase
            .from("enrollments")
            .update({ payment_verified: true })
            .eq("id", enrollment.id);
    }

    // 3. Forzar módulos aprobados
    const modules = ["modulo-1", "modulo-2", "modulo-3", "modulo-4", "modulo-5", "modulo-6"];
    
    for (const mod of modules) {
        const { data: existingProgress } = await supabase
            .from("progress")
            .select("id")
            .eq("user_id", celeste.id)
            .eq("course_id", courseId)
            .eq("module_id", mod)
            .maybeSingle();

        if (existingProgress) {
            await supabase
                .from("progress")
                .update({ score: 100, completed: true })
                .eq("id", existingProgress.id);
        } else {
            // Generar ID único
            const uuid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7);
            
            await supabase
                .from("progress")
                .insert({
                    id: uuid,
                    user_id: celeste.id,
                    course_id: courseId,
                    module_id: mod,
                    score: 100,
                    completed: true
                });
        }
    }

    console.log("--------------------------------------------------");
    console.log("🎉 ¡CELESTE HA APROBADO TODO EL PROGRAMA HIPOTÉTICAMENTE!");
    console.log("--------------------------------------------------");
    console.log(`🔗 Aquí tienes la URL directa para previsualizar su certificado:`);
    console.log(`http://localhost:3000/formacion-academica/${courseId}/certificado?studentId=${celeste.id}`);
}

run().catch(console.error);
