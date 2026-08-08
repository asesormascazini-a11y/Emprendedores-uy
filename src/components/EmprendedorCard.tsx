import type { Emprendedor } from "@prisma/client";

export function EmprendedorCard({ emprendedor }: { emprendedor: Emprendedor }) {
  return (
    <article className="rounded-lg border border-gray-200 p-4 shadow-sm transition hover:shadow-md">
      <h3 className="text-lg font-semibold text-brand-700">{emprendedor.nombre}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {emprendedor.rubro} · {emprendedor.ciudad ? `${emprendedor.ciudad}, ` : ""}
        {emprendedor.departamento}
      </p>
      <p className="mt-2 text-sm text-gray-700">{emprendedor.descripcion}</p>
      {emprendedor.sitioWeb && (
        <a
          href={emprendedor.sitioWeb}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline"
        >
          Visitar sitio →
        </a>
      )}
    </article>
  );
}
