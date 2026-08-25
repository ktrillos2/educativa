import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { classId } = await request.json();
    const session = await getSession();

    if (!session || !classId) {
      return NextResponse.json({ error: "No autorizado o faltan datos" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Buscar el registro de asistencia abierto más reciente
    const { data: attendance } = await supabase
      .from("class_attendance")
      .select("id, joined_at")
      .eq("class_id", classId)
      .eq("user_id", session.userId)
      .is("left_at", null)
      .order("joined_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (attendance) {
      const joinedAt = new Date(attendance.joined_at);
      const leftAt = new Date();
      const durationSeconds = Math.round((leftAt.getTime() - joinedAt.getTime()) / 1000);

      await supabase
        .from("class_attendance")
        .update({ 
          left_at: leftAt.toISOString(), 
          duration_seconds: durationSeconds 
        })
        .eq("id", attendance.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Attendance Leave Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
