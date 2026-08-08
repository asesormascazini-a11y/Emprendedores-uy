import { prisma } from "@/lib/prisma";
import {
  logout,
  publicarEmprendedor,
  rechazarEmprendedor,
  publicarFeria,
  rechazarFeria,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [emprendedoresPendientes, feriasPendientes] = await Promise.all([
    prisma.emprendedor.findMany({
      where: { publicado: false },
      orderBy: { createdAt: "asc" },
    }),
    prisma.feria.findMany({
      where: { publicado: false },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-700">Moderación</h1>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-500 hover:text-brand-600">
            Salir
          </button>
        </form>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Emprendedores pendientes ({emprendedoresPendientes.length})
        </h2>
        {emprendedoresPendientes.length === 0 ? (
          <p className="text-sm text-gray-500">No hay nada pendiente.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {emprendedoresPendientes.map((e) => (
              <div key={e.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-gray-800">{e.nombre}</h3>
                    <p className="text-sm text-gray-500">
                      {e.rubro} · {e.departamento}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">{e.descripcion}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {e.email}
                      {e.telefono ? ` · ${e.telefono}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <form action={publicarEmprendedor.bind(null, e.id)}>
                      <button
                        type="submit"
                        className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
                      >
                        Publicar
                      </button>
                    </form>
                    <form action={rechazarEmprendedor.bind(null, e.id)}>
                      <button
                        type="submit"
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        Rechazar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Ferias pendientes ({feriasPendientes.length})
        </h2>
        {feriasPendientes.length === 0 ? (
          <p className="text-sm text-gray-500">No hay nada pendiente.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {feriasPendientes.map((f) => (
              <div key={f.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-gray-800">{f.nombre}</h3>
                    <p className="text-sm text-gray-500">
                      {f.fecha.toLocaleDateString("es-UY")} · {f.departamento}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">{f.descripcion}</p>
                    <p className="mt-1 text-xs text-gray-400">{f.contactoEmail}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <form action={publicarFeria.bind(null, f.id)}>
                      <button
                        type="submit"
                        className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
                      >
                        Publicar
                      </button>
                    </form>
                    <form action={rechazarFeria.bind(null, f.id)}>
                      <button
                        type="submit"
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        Rechazar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
