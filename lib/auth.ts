import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
  
  if (user.length === 0) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user[0].password);
  
  if (!isValid) {
    return null;
  }

  return user[0];
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  
  if (!userId) {
    return null;
  }

  const user = await db.select().from(users).where(eq(users.id, parseInt(userId))).limit(1);
  
  return user.length > 0 ? user[0] : null;
}

export async function setSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set("userId", userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}

