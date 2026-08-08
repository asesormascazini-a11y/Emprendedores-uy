"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RUBROS, DEPARTAMENTOS } from "@/lib/constants";

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function crearEmprendedor(formData: FormData) {
  const nombre = str(formData, "nombre");
  const descripcion = str(formData, "descripcion");
  const rubro = str(formData, "rubro");
  const departamento = str(formData, "departamento");
  const ciudad = str(formData, "ciudad");
  const email = str(formData, "email");
  const telefono = str(formData, "telefono");
  const sitioWeb = str(formData, "sitioWeb");
  const instagram = str(formData, "instagram");

  const esValido =
    nombre.length > 0 &&
    descripcion.length > 0 &&
    email.length > 0 &&
    (RUBROS as readonly string[]).includes(rubro) &&
    (DEPARTAMENTOS as readonly string[]).includes(departamento);

  if (!esValido) {
    redirect("/sumar?error=1");
  }

  await prisma.emprendedor.create({
    data: {
      nombre,
      descripcion,
      rubro,
      departamento,
      ciudad: ciudad || null,
      email,
      telefono: telefono || null,
      sitioWeb: sitioWeb || null,
      instagram: instagram || null,
      publicado: false,
    },
  });

  redirect("/sumar?exito=1");
}
