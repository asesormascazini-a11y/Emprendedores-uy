import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DIAS_A_MOSTRAR = 14;

function inicioDelDia(fecha: Date) {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function MiPerfilPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const emprendedor = await prisma.emprendedor.findUnique({
    where: { dashboardToken: token },
  });

  if (!emprendedor) {
    notFound();
  }

  const desde = inicioDelDia(new Date());
  desde.setDate(desde.getDate() - (DIAS_A_MOSTRAR - 1));

  const [totalVisitas, visitasRecientes] = await Promise.all([
    prisma.visita.count({ where: { emprendedorId: emprendedor.id } }),
    prisma.visita.findMany({
      where: { emprendedorId: emprendedor.id, createdAt: { gte: desde } },
      select: { createdAt: true },
    }),
  ]);

  const dias = Array.from({ length: DIAS_A_MOSTRAR }, (_, i) => {
    const fecha = inicioDelDia(new Date());
    fecha.setDate(fecha.getDate() - (DIAS_A_MOSTRAR - 1 - i));
    return { fecha, count: 0 };
  });

  for (const visita of visitasRecientes) {
    const clave = inicioDelDia(visita.createdAt).getTime();
    const bucket = dias.find((d) => d.fecha.getTime() === clave);
    if (bucket) bucket.count += 1;
  }

  const maxCount = Math.max(1, ...dias.map((d) => d.count));
  const visitas14dias = dias.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm text-gray-500">Panel privado de</p>
      <h1 className="text-2xl font-bold text-brand-700">{emprendedor.nombre}</h1>
      <p className="mt-1 text-sm">
        Estado:{" "}
        {emprendedor.publicado ? (
          <span className="font-medium text-brand-700">Publicado en el directorio</span>
        ) : (
          <span className="font-medium text-amber-600">Pendiente de revisión</span>
        )}
      </p>
      {emprendedor.publicado && (
        <Link
          href={`/emprendedores/${emprendedor.id}`}
          className="text-sm text-brand-600 hover:underline"
        >
          Ver mi perfil público →
        </Link>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Visitas totales
          </p>
          <p className="mt-1 text-3xl font-bold text-brand-700">{totalVisitas}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Últimos {DIAS_A_MOSTRAR} días
          </p>
          <p className="mt-1 text-3xl font-bold text-brand-700">{visitas14dias}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-800">
          Visitas por día
        </h2>
        <div className="flex h-32 items-end gap-1">
          {dias.map((d) => (
            <div
              key={d.fecha.toISOString()}
              className="group relative flex-1"
              title={`${d.count} visita${d.count === 1 ? "" : "s"} · ${d.fecha.toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit" })}`}
            >
              <div
                className="w-full rounded-t bg-brand-500 transition-colors group-hover:bg-brand-600"
                style={{ height: `${Math.max(4, (d.count / maxCount) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>
            {dias[0].fecha.toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit" })}
          </span>
          <span>
            {dias[dias.length - 1].fecha.toLocaleDateString("es-UY", {
              day: "2-digit",
              month: "2-digit",
            })}
          </span>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Guardá este link — es la única forma de volver a ver estas
        estadísticas.
      </p>
    </div>
  );
}
