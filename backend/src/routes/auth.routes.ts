import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { codigoSiss, carnet } = req.body;

    if (!codigoSiss || !carnet) {
      return res.status(400).json({
        mensaje: 'Código SISS y carnet son obligatorios',
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        codigoSiss,
      },
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas',
      });
    }

    const carnetCorrecto = usuario.carnet === carnet;

    if (!carnetCorrecto) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas',
      });
    }

    const token = jwt.sign(
      {
        usuarioId: usuario.id,
        codigoSiss: usuario.codigoSiss,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '8h',
      }
    );

    return res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        codigoSiss: usuario.codigoSiss,
        nombreCompleto: usuario.nombreCompleto,
        cargo: usuario.cargo,
        rol: usuario.rol,
        horarioInicio: usuario.horarioInicio,
        horarioFin: usuario.horarioFin,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
});

export default router;