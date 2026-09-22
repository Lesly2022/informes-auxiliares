import { Router } from 'express';
import { verificarToken, AuthRequest } from '../middlewares/auth.middleware.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', verificarToken, async (req: AuthRequest, res) => {
  try {
    const usuarioId = req.usuario?.usuarioId;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'Usuario no identificado',
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        codigoSiss: true,
        nombreCompleto: true,
        cargo: true,
        rol: true,
        horarioInicio: true,
        horarioFin: true,
        activo: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
      });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener el perfil',
    });
  }
});

export default router;