# Emprendedores UY

El lugar donde los emprendedores uruguayos se muestran y se encuentran: un
directorio filtrable por rubro y departamento, contacto directo por
WhatsApp, un panel privado con estadísticas de visitas para cada
emprendedor, y un calendario de ferias/mercados.

## Qué lo hace distinto de un directorio genérico

- **WhatsApp-first**: el contacto principal de cada perfil es un botón a
  WhatsApp con mensaje pre-armado, no un formulario o un `mailto:`.
- **El emprendedor ve resultados**: al sumarse recibe un link privado
  (`/mi-perfil/[token]`) con un panel de visitas a su perfil, día a día —
  una razón real para mantenerlo actualizado.
- **No es solo un listado**: el calendario de ferias (`/ferias`) le da al
  sitio una razón de visita recurrente más allá de buscar un negocio
  puntual, y conecta lo digital con encuentros físicos reales.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) para estilos
- [Prisma](https://www.prisma.io/) + PostgreSQL como ORM y base de datos
- ESLint (flat config) para linting

## Estructura

```
prisma/
  schema.prisma          Modelos: Emprendedor, Visita, Feria
  migrations/              Migraciones de Prisma
src/
  app/
    layout.tsx             Layout raíz (header + footer)
    page.tsx                Home: propuesta de valor, stats, categorías, próximas ferias
    emprendedores/
      page.tsx               Directorio con filtros (rubro/departamento/búsqueda)
      [id]/page.tsx           Perfil público: CTA de WhatsApp + registra una Visita
    sumar/
      page.tsx                Formulario para sumar un emprendimiento
      actions.ts               Server Action: valida, guarda y devuelve el link del dashboard
    mi-perfil/
      [token]/page.tsx         Panel privado: visitas totales + gráfico de últimos 14 días
    ferias/
      page.tsx                 Calendario de ferias/mercados publicadas y futuras
      publicar/
        page.tsx                 Formulario para publicar una feria
        actions.ts                Server Action equivalente a sumar/actions.ts
    api/
      emprendedores/
        route.ts                 API REST: GET (listar, con filtros) / POST (crear)
    admin/
      page.tsx                    Panel de moderación: pendientes + publicar/rechazar
      actions.ts                   Server Actions de moderación + logout
      login/
        page.tsx                    Login con contraseña
        actions.ts                   Server Action de login
  components/
    Header.tsx
    Footer.tsx
    EmprendedorCard.tsx
  lib/
    prisma.ts                Cliente Prisma singleton
    constants.ts              Rubros y departamentos de Uruguay
    whatsapp.ts                Normaliza números UY y arma links wa.me
    auth.ts                     Sesión de admin (cookie firmada por hash)
  proxy.ts                   Protege /admin/* redirigiendo a /admin/login sin sesión
```

## Cómo funciona la moderación

Los emprendimientos (`/sumar`) y las ferias (`/ferias/publicar`) se guardan
con `publicado: false` y no aparecen en las páginas públicas ni en la API
hasta ser aprobados desde el panel `/admin` (protegido por la contraseña
`ADMIN_PASSWORD`). El acceso es una cookie de sesión sin librerías externas:
no hay usuarios ni roles, solo una contraseña compartida — pensado para un
solo moderador. `/admin` no está enlazado desde la navegación pública.

## Dashboard privado del emprendedor

Cada `Emprendedor` tiene un `dashboardToken` único generado al crearse.
`/mi-perfil/[token]` es la única forma de acceder a esas estadísticas — no
hay login. El link se muestra una sola vez, en la pantalla de éxito de
`/sumar`, así que quien se suma debe guardarlo. El token **nunca** se
expone en la API pública ni en el directorio.

## Desarrollo

1. Copiar `.env.example` a `.env`, completar `DATABASE_URL` con una base
   PostgreSQL y elegir un `ADMIN_PASSWORD`.
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Aplicar las migraciones a la base de datos:

   ```bash
   npm run db:migrate
   ```

4. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — levanta el build de producción
- `npm run lint` — linting con ESLint
- `npm run db:migrate` — aplica migraciones de Prisma
- `npm run db:studio` — abre Prisma Studio para explorar/moderar los datos
