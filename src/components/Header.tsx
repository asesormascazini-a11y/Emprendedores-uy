import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-brand-700">
          Emprendedores UY
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/emprendedores" className="hover:text-brand-600">
            Directorio
          </Link>
        </nav>
      </div>
    </header>
  );
}
