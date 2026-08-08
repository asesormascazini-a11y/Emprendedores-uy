import { crearEmprendedor } from "./actions";
import { RUBROS, DEPARTAMENTOS } from "@/lib/constants";

export default async function SumarPage({
  searchParams,
}: {
  searchParams: Promise<{ exito?: string; error?: string }>;
}) {
  const { exito, error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-brand-700">Sumá tu emprendimiento</h1>
      <p className="mt-2 text-gray-600">
        Completá el formulario y tu emprendimiento se revisa antes de
        publicarse en el directorio. Es gratis.
      </p>

      {exito && (
        <p className="mt-4 rounded-md bg-brand-50 px-4 py-3 text-sm text-brand-700">
          ¡Gracias! Recibimos tu emprendimiento y lo vamos a revisar antes de
          publicarlo.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Faltan datos obligatorios (nombre, descripción, email, rubro y
          departamento). Revisá el formulario e intentá de nuevo.
        </p>
      )}

      <form action={crearEmprendedor} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nombre del emprendimiento *
          </label>
          <input
            type="text"
            name="nombre"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Descripción *
          </label>
          <textarea
            name="descripcion"
            required
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Rubro *
            </label>
            <select
              name="rubro"
              required
              defaultValue=""
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Elegí un rubro
              </option>
              {RUBROS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Departamento *
            </label>
            <select
              name="departamento"
              required
              defaultValue=""
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Elegí un departamento
              </option>
              {DEPARTAMENTOS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Ciudad / localidad
          </label>
          <input
            type="text"
            name="ciudad"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email de contacto *
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sitio web
            </label>
            <input
              type="url"
              name="sitioWeb"
              placeholder="https://"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              placeholder="@tu_emprendimiento"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-md bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
