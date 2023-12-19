import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorised", { status: 401 });

    if (!params.serverId) return new NextResponse("Server ID Missing", { status: 400 });
    
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[SERVER_ID]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// http://localhost:3000/invite/a5c736d8-a4b4-496d-b3c8-ecbfbd373919