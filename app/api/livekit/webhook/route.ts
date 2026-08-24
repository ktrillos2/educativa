import { WebhookReceiver } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const receiver = new WebhookReceiver(
      process.env.LIVEKIT_API_KEY || "",
      process.env.LIVEKIT_API_SECRET || ""
    );

    const event = await receiver.receive(body, authHeader);
    console.log(`[LiveKit Webhook] Event: ${event.event} for room: ${event.room?.name}, participant: ${event.participant?.identity}`);

    const supabase = createAdminClient();

    if (event.event === "participant_joined") {
      const classId = event.room?.name; 
      const userId = event.participant?.identity;

      if (classId && userId) {
        await supabase.from("class_attendance").insert({
          class_id: classId,
          user_id: userId,
          // joined_at defaults to now() in Postgres, but we can use event's timestamp
        });
      }
    } 
    else if (event.event === "participant_left") {
      const classId = event.room?.name;
      const userId = event.participant?.identity;

      if (classId && userId) {
         // Find latest attendance record for this user and class where left_at is null
         const { data: attendance } = await supabase
            .from("class_attendance")
            .select("id, joined_at")
            .eq("class_id", classId)
            .eq("user_id", userId)
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
      }
    } 
    // Handle egress ended (recordings) if applicable in the future
    // else if (event.event === "egress_ended") { }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("LiveKit Webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
