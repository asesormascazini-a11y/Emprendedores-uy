"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEPARTAMENTOS } from "@/lib/constants";

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function crearFeria(formData: FormData) {
  const nombre = str(formData, "nombre");
  const descripcion = str(formData, "descripcion");
  const departamento = str(formData, "departamento");
  const ciudad = str(formData, "ciudad");
  const lugar = str(formData, "lugar");
  const fechaTexto = str(formData, "fecha");
  const sitioWeb = str(formData, "sitioWeb");
  const contactoEmail = str(formData, "contactoEmail");

  const fecha = fechaTexto ? new Date(fechaTexto) : null;
  const fechaValida = fecha instanceof Date && !isNaN(fecha.getTime()) && fecha.getTime() > Date.now();

  const esValido =
    nombre.length > 0 &&
    descripcion.length > 0 &&
    contactoEmail.length > 0 &&
    fechaValida &&
    (DEPARTAMENTOS as readonly string[]).includes(departamento);

  if (!esValido || !fecha) {
    redirect("/ferias/publicar?error=1");
  }

  await prisma.feria.create({
    data: {
      nombre,
      descripcion,
      departamento,
      ciudad: ciudad || null,
      lugar: lugar || null,
      fecha,
      sitioWeb: sitioWeb || null,
      contactoEmail,
      publicado: false,
    },
  });

  redirect("/ferias/publicar?exito=1");
}
