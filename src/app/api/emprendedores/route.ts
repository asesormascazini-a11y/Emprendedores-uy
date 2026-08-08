import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const emprendedores = await prisma.emprendedor.findMany({
    where: { publicado: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(emprendedores);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { nombre, descripcion, rubro, departamento } = body;
  if (!nombre || !descripcion || !rubro || !departamento) {
    return NextResponse.json(
      { error: "nombre, descripcion, rubro y departamento son obligatorios" },
      { status: 400 }
    );
  }

  const emprendedor = await prisma.emprendedor.create({ data: body });
  return NextResponse.json(emprendedor, { status: 201 });
}
