-- CreateTable
CREATE TABLE "Emprendedor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "rubro" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "ciudad" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "sitioWeb" TEXT,
    "instagram" TEXT,
    "logoUrl" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Emprendedor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Emprendedor_rubro_idx" ON "Emprendedor"("rubro");

-- CreateIndex
CREATE INDEX "Emprendedor_departamento_idx" ON "Emprendedor"("departamento");
