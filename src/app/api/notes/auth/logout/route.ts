import { NextResponse } from "next/server";
import { clearNotesAuthCookie } from "@/lib/notes/jwt";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await clearNotesAuthCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notes logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
