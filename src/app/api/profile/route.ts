import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    return NextResponse.json({ profile: profile || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Check if a profile exists
    const existing = await prisma.profile.findFirst();
    
    let profile;
    if (existing) {
      profile = await prisma.profile.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          tagline: data.tagline,
          bio: data.bio,
          currentRole: data.currentRole,
          currentFocus: typeof data.currentFocus === 'string' ? data.currentFocus.split(',').map((s:string)=>s.trim()) : data.currentFocus,
          location: data.location,
          linkedinUrl: data.linkedinUrl,
          email: data.email,
          resumeUrl: data.resumeUrl,
        }
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          name: data.name || "Default Name",
          tagline: data.tagline || "",
          bio: data.bio || "",
          currentRole: data.currentRole || "",
          currentFocus: typeof data.currentFocus === 'string' ? data.currentFocus.split(',').map((s:string)=>s.trim()) : (data.currentFocus || []),
          location: data.location || "",
          linkedinUrl: data.linkedinUrl || "",
          email: data.email || "",
          resumeUrl: data.resumeUrl || "",
        }
      });
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
