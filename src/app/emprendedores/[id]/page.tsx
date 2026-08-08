import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { linkWhatsApp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function EmprendedorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const emprendedor = await prisma.emprendedor.findUnique({ where: { id } });

  if (!emprendedor || !emprendedor.publicado) {
    notFound();
  }

  await prisma.visita.create({ data: { emprendedorId: emprendedor.id } });

  const otrosContactos = [
    emprendedor.email && { label: "Email", href: `mailto:${emprendedor.email}`, text: emprendedor.email },
    emprendedor.sitioWeb && { label: "Sitio web", href: emprendedor.sitioWeb, text: emprendedor.sitioWeb },
    emprendedor.instagram && {
      label: "Instagram",
      href: `https://instagram.com/${emprendedor.instagram.replace(/^@/, "")}`,
      text: emprendedor.instagram,
    },
  ].filter(Boolean) as { label: string; href: string; text: string }[];

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/emprendedores" className="text-sm text-brand-600 hover:underline">
        ← Volver al directorio
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-brand-700">{emprendedor.nombre}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {emprendedor.rubro} · {emprendedor.ciudad ? `${emprendedor.ciudad}, ` : ""}
        {emprendedor.departamento}
      </p>

      <p className="mt-4 whitespace-pre-line text-gray-700">{emprendedor.descripcion}</p>

      {emprendedor.telefono && (
        <a
          href={linkWhatsApp(
            emprendedor.telefono,
            `Hola ${emprendedor.nombre}, te encontré en Emprendedores UY y quería consultarte.`
          )}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1ebe5a]"
        >
          Escribir por WhatsApp
        </a>
      )}

      {otrosContactos.length > 0 && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-800">Más contacto</h2>
          <ul className="space-y-1 text-sm">
            {otrosContactos.map((c) => (
              <li key={c.label}>
                <span className="text-gray-500">{c.label}: </span>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="text-brand-600 hover:underline"
                >
                  {c.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
