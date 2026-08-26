import { NextResponse } from "next/server";
import { RoomServiceClient } from "livekit-server-sdk";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: "LiveKit no configurado" }, { status: 500 });
    }

    // --- 1. LiveKit real-time data ---
    const svc = new RoomServiceClient(wsUrl, apiKey, apiSecret);
    let activeRooms: any[] = [];
    let totalLiveParticipants = 0;

    try {
      activeRooms = await svc.listRooms();
      totalLiveParticipants = activeRooms.reduce(
        (sum, room) => sum + (room.numParticipants || 0),
        0
      );
    } catch (_) {
      // LiveKit may not be reachable in local dev — gracefully degrade
      activeRooms = [];
    }

    // --- 2. Internal Supabase attendance data (our source of truth) ---
    const supabase = createAdminClient();

    // Total minutes connected this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: monthlyAttendance } = await supabase
      .from("class_attendance")
      .select("duration_seconds")
      .gte("joined_at", startOfMonth.toISOString())
      .not("duration_seconds", "is", null);

    const totalSecondsThisMonth = (monthlyAttendance || []).reduce(
      (sum, r) => sum + (r.duration_seconds || 0),
      0
    );
    const totalMinutesThisMonth = Math.round(totalSecondsThisMonth / 60);

    // Total classes this month
    const { count: classesThisMonth } = await supabase
      .from("live_classes")
      .select("*", { count: "exact", head: true })
      .gte("scheduled_at", startOfMonth.toISOString());

    // Total unique students who attended this month
    const { data: uniqueStudents } = await supabase
      .from("class_attendance")
      .select("user_id")
      .gte("joined_at", startOfMonth.toISOString());

    const uniqueStudentCount = new Set((uniqueStudents || []).map((r) => r.user_id)).size;

    // Total classes by status
    const { data: classStats } = await supabase
      .from("live_classes")
      .select("status");

    const totalScheduled = (classStats || []).filter((c) => c.status === "scheduled").length;
    const totalInProgress = (classStats || []).filter((c) => c.status === "in_progress").length;
    const totalFinished = (classStats || []).filter((c) => c.status === "finished").length;

    // Plan limit: 50,000 participant-minutes/month (LiveKit Free)
    const PLAN_LIMIT_MINUTES = 50000;
    const usagePercent = Math.min(100, Math.round((totalMinutesThisMonth / PLAN_LIMIT_MINUTES) * 100));

    return NextResponse.json({
      livekit: {
        activeRooms: activeRooms.length,
        totalLiveParticipants,
        totalMinutesThisMonth,
        usagePercent,
        planLimitMinutes: PLAN_LIMIT_MINUTES,
      },
      classes: {
        scheduled: totalScheduled,
        inProgress: totalInProgress,
        finished: totalFinished,
        total: totalScheduled + totalInProgress + totalFinished,
        thisMonth: classesThisMonth || 0,
      },
      attendance: {
        uniqueStudentsThisMonth: uniqueStudentCount,
      },
    });
  } catch (error) {
    console.error("LiveKit stats error:", error);
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
}
