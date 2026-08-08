"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, adminSessionToken } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = formData.get("password")?.toString() ?? "";
  const esperada = process.env.ADMIN_PASSWORD;

  if (!esperada || password !== esperada) {
    redirect("/admin/login?error=1");
  }

  const token = await adminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}
