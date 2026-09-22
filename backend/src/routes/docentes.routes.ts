import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const docentes = await prisma.docente.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombreCompleto: 'asc',
      },
    });

    res.json(docentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al obtener docentes',
    });
  }
});

export default router;