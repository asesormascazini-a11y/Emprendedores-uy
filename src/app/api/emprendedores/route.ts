import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RUBROS, DEPARTAMENTOS } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rubro = searchParams.get("rubro") ?? undefined;
  const departamento = searchParams.get("departamento") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const where: Prisma.EmprendedorWhereInput = {
    publicado: true,
    ...(rubro ? { rubro } : {}),
    ...(departamento ? { departamento } : {}),
    ...(q
      ? {
          OR: [
            { nombre: { contains: q, mode: "insensitive" } },
            { descripcion: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const emprendedores = await prisma.emprendedor.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(emprendedores);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { nombre, descripcion, rubro, departamento, email } = body ?? {};

  if (
    !nombre ||
    !descripcion ||
    !email ||
    !(RUBROS as readonly string[]).includes(rubro) ||
    !(DEPARTAMENTOS as readonly string[]).includes(departamento)
  ) {
    return NextResponse.json(
      {
        error:
          "nombre, descripcion, email, rubro (válido) y departamento (válido) son obligatorios",
      },
      { status: 400 }
    );
  }

  const emprendedor = await prisma.emprendedor.create({
    data: {
      nombre,
      descripcion,
      rubro,
      departamento,
      email,
      ciudad: body.ciudad || null,
      telefono: body.telefono || null,
      sitioWeb: body.sitioWeb || null,
      instagram: body.instagram || null,
      publicado: false,
    },
  });
  return NextResponse.json(emprendedor, { status: 201 });
}
