import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const salas = await prisma.sala.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    return res.json(salas);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: 'Error al obtener salas',
    });
  }
});

export default router;