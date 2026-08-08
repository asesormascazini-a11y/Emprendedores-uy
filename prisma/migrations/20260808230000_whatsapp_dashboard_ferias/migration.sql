-- AlterTable
ALTER TABLE "Emprendedor" ADD COLUMN     "dashboardToken" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Visita" (
    "id" TEXT NOT NULL,
    "emprendedorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "ciudad" TEXT,
    "lugar" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "sitioWeb" TEXT,
    "contactoEmail" TEXT NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visita_emprendedorId_createdAt_idx" ON "Visita"("emprendedorId", "createdAt");

-- CreateIndex
CREATE INDEX "Feria_fecha_idx" ON "Feria"("fecha");

-- CreateIndex
CREATE INDEX "Feria_departamento_idx" ON "Feria"("departamento");

-- CreateIndex
CREATE UNIQUE INDEX "Emprendedor_dashboardToken_key" ON "Emprendedor"("dashboardToken");

-- AddForeignKey
ALTER TABLE "Visita" ADD CONSTRAINT "Visita_emprendedorId_fkey" FOREIGN KEY ("emprendedorId") REFERENCES "Emprendedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

