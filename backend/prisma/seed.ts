import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // DOCENTES
  const docentes = [
    'Msc. Aparicio Yuja Nancy Tatiana',
    'Lic. Antezana Camacho Marcelo',
    'Ing. Villarroel Novillo Jimmy',
    'Lic. Calancha Navia Boris Marcelo',
    'Lic. Cussi Nicolas Grover Humberto',
  ];

  for (const nombreCompleto of docentes) {
    const existe = await prisma.docente.findFirst({
      where: { nombreCompleto },
    });

    if (!existe) {
      await prisma.docente.create({
        data: { nombreCompleto },
      });
    }
  }

  // MATERIAS
  const materias = [
    {
      codigo: '2010015',
      nombre: 'Base de Datos I',
    },
    {
      codigo: '2010210',
      nombre: 'Informática Forense',
    },
    {
      codigo: '2010012',
      nombre: 'Métodos, Técnicas y Taller de Programación',
    },
    {
      codigo: '2010053',
      nombre: 'Taller de Base de Datos',
    },
    {
      codigo: '2010035',
      nombre: 'Aplicación de Sistemas Operativos',
    },
  ];

  for (const materia of materias) {
    const existe = await prisma.materia.findFirst({
      where: { nombre: materia.nombre },
    });

    if (!existe) {
      await prisma.materia.create({
        data: materia,
      });
    }
  }
  // USUARIO DE PRUEBA
  const passwordHash = await bcrypt.hash('123456', 10);

  const usuarioExiste = await prisma.usuario.findUnique({
    where: {
      codigoSiss: '202001823',
    },
  });

  if (!usuarioExiste) {
    await prisma.usuario.create({
      data: {
        codigoSiss: '202001823',
        carnet: '8018935',
        nombreCompleto: 'Jose Alejandro Montaño Laura',
        cargo: 'Auxiliar de Laboratorio de Cómputo',
        passwordHash,
        rol: 'AUXILIAR',
        horarioInicio: '09:00',
        horarioFin: '13:00',
        activo: true,
      },
    });
  }

  console.log('Datos iniciales creados correctamente');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });