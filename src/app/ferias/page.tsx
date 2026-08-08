import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEPARTAMENTOS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function FeriasPage({
  searchParams,
}: {
  searchParams: Promise<{ departamento?: string }>;
}) {
  const { departamento } = await searchParams;

  const ferias = await prisma.feria.findMany({
    where: {
      publicado: true,
      fecha: { gte: new Date() },
      ...(departamento ? { departamento } : {}),
    },
    orderBy: { fecha: "asc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-700">Ferias y mercados</h1>
        <Link
          href="/ferias/publicar"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Publicar una feria
        </Link>
      </div>
      <p className="mt-2 text-gray-600">
        Próximos eventos donde encontrarte con emprendedores uruguayos.
      </p>

      <form className="mt-6 flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-white p-4">
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
        {departamento && (
          <Link
            href="/ferias"
            className="flex items-center text-sm text-gray-500 hover:text-brand-600"
          >
            Limpiar filtro
          </Link>
        )}
      </form>

      {ferias.length === 0 ? (
        <p className="mt-6 text-gray-500">
          Todavía no hay ferias publicadas
          {departamento ? ` en ${departamento}` : ""}.{" "}
          <Link href="/ferias/publicar" className="text-brand-600 hover:underline">
            ¿Organizás una? Publicala vos.
          </Link>
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {ferias.map((feria) => (
            <div
              key={feria.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold text-brand-700">{feria.nombre}</h2>
                <span className="text-sm font-medium text-gray-500">
                  {feria.fecha.toLocaleDateString("es-UY", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {feria.lugar ? `${feria.lugar} · ` : ""}
                {feria.ciudad ? `${feria.ciudad}, ` : ""}
                {feria.departamento}
              </p>
              <p className="mt-2 text-sm text-gray-700">{feria.descripcion}</p>
              {feria.sitioWeb && (
                <a
                  href={feria.sitioWeb}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-brand-600 hover:underline"
                >
                  Más información →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
