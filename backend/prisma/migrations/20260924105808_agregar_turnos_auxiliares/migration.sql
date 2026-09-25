-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO');

-- CreateTable
CREATE TABLE "TurnoAuxiliar" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "dia" "DiaSemana" NOT NULL,
    "horarioInicio" TEXT NOT NULL,
    "horarioFin" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TurnoAuxiliar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TurnoAuxiliar_usuarioId_idx" ON "TurnoAuxiliar"("usuarioId");

-- AddForeignKey
ALTER TABLE "TurnoAuxiliar" ADD CONSTRAINT "TurnoAuxiliar_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
