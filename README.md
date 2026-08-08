# Emprendedores UY

El lugar donde los emprendedores uruguayos se muestran y se encuentran:
un directorio público filtrable por rubro y departamento, con un
formulario para que cualquier emprendimiento se sume (previa revisión).

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) para estilos
- [Prisma](https://www.prisma.io/) + PostgreSQL como ORM y base de datos
- ESLint (flat config) para linting

## Estructura

```
prisma/
  schema.prisma        Modelo de datos (Emprendedor)
  migrations/           Migraciones de Prisma
src/
  app/
    layout.tsx           Layout raíz (header + footer)
    page.tsx              Home: propuesta de valor, stats, categorías
    emprendedores/
      page.tsx             Directorio con filtros (rubro/departamento/búsqueda)
      [id]/page.tsx         Perfil público de un emprendimiento
    sumar/
      page.tsx              Formulario para sumar un emprendimiento
      actions.ts             Server Action que valida y guarda (pendiente de revisión)
    api/
      emprendedores/
        route.ts             API REST: GET (listar, con filtros) / POST (crear)
  components/
    Header.tsx
    Footer.tsx
    EmprendedorCard.tsx
  lib/
    prisma.ts              Cliente Prisma singleton
    constants.ts            Rubros y departamentos de Uruguay
```

## Cómo funciona la moderación

Los emprendimientos enviados desde `/sumar` (o vía `POST /api/emprendedores`)
se guardan con `publicado: false` y no aparecen en el directorio ni en la
API pública hasta que alguien los marque como `publicado: true` (por ahora,
manualmente vía `npm run db:studio`).

## Desarrollo

1. Copiar `.env.example` a `.env` y completar `DATABASE_URL` con una base
   PostgreSQL.
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
