import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.NOTES_JWT_SECRET || "your-secret-key-change-this-in-production"
);

export interface NotesJWTPayload extends JWTPayload {
  userId: string;
  email: string;
}

export async function signNotesToken(payload: NotesJWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyNotesToken(token: string): Promise<NotesJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as NotesJWTPayload;
  } catch {
    return null;
  }
}

export async function setNotesAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("notes-auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function getNotesAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("notes-auth");
  return cookie?.value || null;
}

export async function clearNotesAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("notes-auth");
}

export async function getCurrentNotesUser(): Promise<NotesJWTPayload | null> {
  const token = await getNotesAuthToken();
  if (!token) return null;
  return verifyNotesToken(token);
}
