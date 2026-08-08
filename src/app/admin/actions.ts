"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

export async function publicarEmprendedor(id: string) {
  await prisma.emprendedor.update({ where: { id }, data: { publicado: true } });
  revalidatePath("/admin");
}

export async function rechazarEmprendedor(id: string) {
  await prisma.emprendedor.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function publicarFeria(id: string) {
  await prisma.feria.update({ where: { id }, data: { publicado: true } });
  revalidatePath("/admin");
}

export async function rechazarFeria(id: string) {
  await prisma.feria.delete({ where: { id } });
  revalidatePath("/admin");
}
