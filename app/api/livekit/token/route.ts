import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const room = searchParams.get("room");

    if (!room) {
      return NextResponse.json({ error: 'Falta el parámetro "room"' }, { status: 400 });
    }

    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: "Servidor mal configurado" }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: session.userId,
      name: session.name || "Estudiante",
    });

    const isAdmin = session.role === "admin";

    at.addGrant({ 
      roomJoin: true, 
      room, 
      canPublish: true, 
      canSubscribe: true,
      roomAdmin: isAdmin, // allows them to mute others, etc
    });

    const token = await at.toJwt();

    // -- INICIO MÓDULO DE ASISTENCIA (SIN WEBHOOKS) --
    // Registramos la entrada a la clase inmediatamente después de darle el token
    const { createAdminClient } = await import("@/utils/supabase/admin");
    const supabase = createAdminClient();
    
    // Solo registrar si no está admin o si quieres registrar a todos
    // Verificamos si ya hay un registro de asistencia abierto
    const { data: existing } = await supabase
      .from("class_attendance")
      .select("id")
      .eq("class_id", room)
      .eq("user_id", session.userId)
      .is("left_at", null)
      .maybeSingle();

    if (!existing) {
       await supabase.from("class_attendance").insert({
         class_id: room,
         user_id: session.userId,
       });
    }
    // -- FIN MÓDULO DE ASISTENCIA --

    return NextResponse.json({ token });
  } catch (error) {
    console.error("LiveKit Token Error:", error);
    return NextResponse.json({ error: "Error generando token" }, { status: 500 });
  }
}
