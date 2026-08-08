import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RUBROS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [totalEmprendedores, proximasFerias] = await Promise.all([
    prisma.emprendedor.count({ where: { publicado: true } }),
    prisma.feria.findMany({
      where: { publicado: true, fecha: { gte: new Date() } },
      orderBy: { fecha: "asc" },
      take: 3,
    }),
  ]);

  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col items-start gap-4">
        <h1 className="text-3xl font-bold text-brand-700 sm:text-4xl">
          El lugar donde los emprendedores uruguayos quieren estar
        </h1>
        <p className="max-w-2xl text-gray-600">
          Sumá tu emprendimiento a un directorio pensado para que te encuentren
          clientes de todo el país, y descubrí a otros emprendedores por rubro
          y departamento.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/sumar"
            className="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Sumar mi emprendimiento
          </Link>
          <Link
            href="/emprendedores"
            className="rounded-md border border-brand-600 px-5 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            Ver directorio
          </Link>
        </div>
        {totalEmprendedores > 0 && (
          <p className="text-sm text-gray-500">
            Ya somos <span className="font-semibold text-brand-700">{totalEmprendedores}</span>{" "}
            emprendimientos en el directorio.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Por qué sumarte
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-medium text-brand-700">Te contactan por WhatsApp</h3>
            <p className="mt-1 text-sm text-gray-600">
              Tu perfil tiene un botón directo a WhatsApp: así es como se
              compra de verdad en Uruguay, sin formularios de por medio.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-medium text-brand-700">Vas a ver quién te visita</h3>
            <p className="mt-1 text-sm text-gray-600">
              Tenés un panel propio con las visitas a tu perfil, día a día. Es
              gratis y no requiere crear una cuenta.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-medium text-brand-700">Comunidad, no solo listado</h3>
            <p className="mt-1 text-sm text-gray-600">
              Sumá y descubrí ferias y mercados donde encontrarte con otros
              emprendedores y con tus clientes.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Explorá por rubro
        </h2>
        <div className="flex flex-wrap gap-2">
          {RUBROS.map((rubro) => (
            <Link
              key={rubro}
              href={`/emprendedores?rubro=${encodeURIComponent(rubro)}`}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-brand-400 hover:text-brand-700"
            >
              {rubro}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Próximas ferias</h2>
          <Link href="/ferias" className="text-sm font-medium text-brand-600 hover:underline">
            Ver todas →
          </Link>
        </div>
        {proximasFerias.length === 0 ? (
          <p className="text-sm text-gray-500">
            Todavía no hay ferias publicadas.{" "}
            <Link href="/ferias/publicar" className="text-brand-600 hover:underline">
              ¿Organizás una? Sumala vos.
            </Link>
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {proximasFerias.map((feria) => (
              <Link
                key={feria.id}
                href="/ferias"
                className="rounded-lg border border-gray-200 bg-white p-4 hover:border-brand-400"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                  {feria.fecha.toLocaleDateString("es-UY", { day: "2-digit", month: "short" })}
                </p>
                <h3 className="mt-1 font-medium text-gray-800">{feria.nombre}</h3>
                <p className="text-sm text-gray-500">{feria.departamento}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
