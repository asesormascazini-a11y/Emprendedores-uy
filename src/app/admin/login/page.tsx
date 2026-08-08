import { login } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-brand-700">Panel de moderación</h1>
      <p className="mt-2 text-sm text-gray-600">
        Ingresá la contraseña para revisar emprendimientos y ferias
        pendientes.
      </p>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Contraseña incorrecta.
        </p>
      )}

      <form action={login} className="mt-6 flex flex-col gap-4">
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="Contraseña"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
