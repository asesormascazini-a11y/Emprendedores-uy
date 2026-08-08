import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EmprendedorCard } from "@/components/EmprendedorCard";
import { RUBROS, DEPARTAMENTOS } from "@/lib/constants";

export const dynamic = "force-dynamic";

type SearchParams = {
  rubro?: string;
  departamento?: string;
  q?: string;
};

export default async function EmprendedoresPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { rubro, departamento, q } = await searchParams;

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

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Directorio</h1>

      <form className="mb-6 flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <input
          type="text"
          name="q"
          placeholder="Buscar por nombre o descripción"
          defaultValue={q ?? ""}
          className="min-w-48 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          name="rubro"
          defaultValue={rubro ?? ""}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los rubros</option>
          {RUBROS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          name="departamento"
          defaultValue={departamento ?? ""}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los departamentos</option>
          {DEPARTAMENTOS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Filtrar
        </button>
        {(rubro || departamento || q) && (
          <Link
            href="/emprendedores"
            className="flex items-center text-sm text-gray-500 hover:text-brand-600"
          >
            Limpiar filtros
          </Link>
        )}
      </form>

      {emprendedores.length === 0 ? (
        <p className="text-gray-500">
          No encontramos emprendimientos con esos filtros.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {emprendedores.map((emprendedor) => (
            <EmprendedorCard key={emprendedor.id} emprendedor={emprendedor} />
          ))}
        </div>
      )}
    </div>
  );
}
