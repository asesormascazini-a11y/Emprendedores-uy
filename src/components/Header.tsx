import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-brand-700">
          Emprendedores UY
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/emprendedores" className="hover:text-brand-600">
            Directorio
          </Link>
          <Link
            href="/sumar"
            className="rounded-md bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700"
          >
            Sumar mi emprendimiento
          </Link>
        </nav>
      </div>
    </header>
  );
}
