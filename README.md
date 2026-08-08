# Emprendedores UY

Directorio web de emprendedores y emprendimientos de Uruguay: permite listar
emprendimientos por rubro y departamento, y sumar nuevos a través de una API.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) para estilos
- [Prisma](https://www.prisma.io/) + PostgreSQL como ORM y base de datos
- ESLint (flat config) para linting

## Estructura

```
prisma/
  schema.prisma        Modelo de datos (Emprendedor)
src/
  app/
    layout.tsx          Layout raíz (header + estilos globales)
    page.tsx             Home
    emprendedores/
      page.tsx           Listado del directorio (server component)
    api/
      emprendedores/
        route.ts          API REST: GET (listar) / POST (crear)
  components/
    Header.tsx
    EmprendedorCard.tsx
  lib/
    prisma.ts             Cliente Prisma singleton
```

## Desarrollo

1. Copiar `.env.example` a `.env` y completar `DATABASE_URL` con una base
   PostgreSQL.
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Aplicar el esquema a la base de datos:

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
- `npm run db:studio` — abre Prisma Studio para explorar los datos
