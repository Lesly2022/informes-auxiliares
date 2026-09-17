-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('AUXILIAR', 'RESPONSABLE', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoInforme" AS ENUM ('BORRADOR', 'GUARDADO', 'REVISADO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "codigoSiss" TEXT NOT NULL,
    "carnet" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "passwordHash" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'AUXILIAR',
    "horarioInicio" TEXT NOT NULL,
    "horarioFin" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Docente" (
    "id" SERIAL NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Informe" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "horarioInicio" TEXT NOT NULL,
    "horarioFin" TEXT NOT NULL,
    "horarioModificado" BOOLEAN NOT NULL DEFAULT false,
    "estado" "EstadoInforme" NOT NULL DEFAULT 'GUARDADO',
    "estadoRecomendacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Informe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActividadAcademica" (
    "id" SERIAL NOT NULL,
    "informeId" INTEGER NOT NULL,
    "docenteId" INTEGER,
    "docenteOtro" TEXT,
    "materiaId" INTEGER,
    "materiaOtra" TEXT,
    "sala" TEXT NOT NULL,
    "horarioInicio" TEXT NOT NULL,
    "horarioFin" TEXT NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActividadAcademica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActividadLaboratorio" (
    "id" SERIAL NOT NULL,
    "informeId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActividadLaboratorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incidencia" (
    "id" SERIAL NOT NULL,
    "informeId" INTEGER NOT NULL,
    "equipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pendiente" (
    "id" SERIAL NOT NULL,
    "informeId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pendiente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_codigoSiss_key" ON "Usuario"("codigoSiss");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_carnet_key" ON "Usuario"("carnet");

-- CreateIndex
CREATE INDEX "Informe_fecha_idx" ON "Informe"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Informe_usuarioId_fecha_key" ON "Informe"("usuarioId", "fecha");

-- AddForeignKey
ALTER TABLE "Informe" ADD CONSTRAINT "Informe_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadAcademica" ADD CONSTRAINT "ActividadAcademica_informeId_fkey" FOREIGN KEY ("informeId") REFERENCES "Informe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadAcademica" ADD CONSTRAINT "ActividadAcademica_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadAcademica" ADD CONSTRAINT "ActividadAcademica_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadLaboratorio" ADD CONSTRAINT "ActividadLaboratorio_informeId_fkey" FOREIGN KEY ("informeId") REFERENCES "Informe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_informeId_fkey" FOREIGN KEY ("informeId") REFERENCES "Informe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pendiente" ADD CONSTRAINT "Pendiente_informeId_fkey" FOREIGN KEY ("informeId") REFERENCES "Informe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
