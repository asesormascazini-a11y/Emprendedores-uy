import { prisma } from "@/lib/prisma";
import { EmprendedorCard } from "@/components/EmprendedorCard";

export const dynamic = "force-dynamic";

export default async function EmprendedoresPage() {
  const emprendedores = await prisma.emprendedor.findMany({
    where: { publicado: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-700">Directorio</h1>
      {emprendedores.length === 0 ? (
        <p className="text-gray-500">Todavía no hay emprendimientos publicados.</p>
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
