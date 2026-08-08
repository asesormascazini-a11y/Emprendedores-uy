import Link from "next/link";
import type { Emprendedor } from "@prisma/client";

export function EmprendedorCard({ emprendedor }: { emprendedor: Emprendedor }) {
  return (
    <Link
      href={`/emprendedores/${emprendedor.id}`}
      className="block rounded-lg border border-gray-200 p-4 shadow-sm transition hover:shadow-md"
    >
      <h3 className="text-lg font-semibold text-brand-700">{emprendedor.nombre}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {emprendedor.rubro} · {emprendedor.ciudad ? `${emprendedor.ciudad}, ` : ""}
        {emprendedor.departamento}
      </p>
      <p className="mt-2 line-clamp-3 text-sm text-gray-700">{emprendedor.descripcion}</p>
    </Link>
  );
}
