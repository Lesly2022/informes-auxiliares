import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const materias = await prisma.materia.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    res.json(materias);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener materias',
    });
  }
});

export default router;