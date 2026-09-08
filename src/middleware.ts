import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyNotesToken } from "@/lib/notes/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /notes/* routes except /notes/login
  if (pathname.startsWith("/notes") && pathname !== "/notes/login") {
    const token = request.cookies.get("notes-auth")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/notes/login", request.url));
    }

    const payload = await verifyNotesToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/notes/login", request.url));
      response.cookies.delete("notes-auth");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*"],
};
