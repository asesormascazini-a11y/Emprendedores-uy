import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-bold text-brand-700">
        Conectamos emprendedores uruguayos
      </h1>
      <p className="max-w-2xl text-gray-600">
        Emprendedores UY es un directorio para dar visibilidad a emprendimientos de
        todo el país: encontralos por rubro y departamento, o sumá el tuyo.
      </p>
      <Link
        href="/emprendedores"
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Ver directorio
      </Link>
    </div>
  );
}
