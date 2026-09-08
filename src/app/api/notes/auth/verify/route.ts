import { NextResponse } from "next/server";
import { getCurrentNotesUser } from "@/lib/notes/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentNotesUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Notes verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
