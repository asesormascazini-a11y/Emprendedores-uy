import { crearFeria } from "./actions";
import { DEPARTAMENTOS } from "@/lib/constants";

export default async function PublicarFeriaPage({
  searchParams,
}: {
  searchParams: Promise<{ exito?: string; error?: string }>;
}) {
  const { exito, error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-brand-700">Publicá una feria o mercado</h1>
      <p className="mt-2 text-gray-600">
        Sumá una feria, mercado o evento donde encontrarte con emprendedores.
        Se revisa antes de publicarse en el calendario.
      </p>

      {exito && (
        <p className="mt-4 rounded-md bg-brand-50 px-4 py-3 text-sm text-brand-700">
          ¡Gracias! Vamos a revisar el evento antes de publicarlo en el
          calendario.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Revisá los datos: nombre, descripción, departamento, fecha (futura) y
          email de contacto son obligatorios.
        </p>
      )}

      <form action={crearFeria} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nombre del evento *
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
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Fecha *
            </label>
            <input
              type="date"
              name="fecha"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
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

        <div className="grid gap-4 sm:grid-cols-2">
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Lugar (dirección o predio)
            </label>
            <input
              type="text"
              name="lugar"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email de contacto *
            </label>
            <input
              type="email"
              name="contactoEmail"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sitio web / redes
            </label>
            <input
              type="url"
              name="sitioWeb"
              placeholder="https://"
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
