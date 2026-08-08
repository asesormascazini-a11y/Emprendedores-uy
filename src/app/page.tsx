import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RUBROS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const totalEmprendedores = await prisma.emprendedor.count({
    where: { publicado: true },
  });

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
            <h3 className="font-medium text-brand-700">Visibilidad real</h3>
            <p className="mt-1 text-sm text-gray-600">
              Tu emprendimiento aparece en un directorio organizado por rubro y
              departamento, fácil de recorrer.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-medium text-brand-700">Es gratis</h3>
            <p className="mt-1 text-sm text-gray-600">
              Publicar tu perfil no tiene costo. Completás un formulario y listo.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-medium text-brand-700">Comunidad local</h3>
            <p className="mt-1 text-sm text-gray-600">
              Un espacio pensado para conectar emprendedores uruguayos entre sí
              y con sus clientes.
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
    </div>
  );
}
