import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import { DiaSemana } from '@prisma/client';
import {
  verificarToken,
  verificarAdmin,
  AuthRequest,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/prueba',
  verificarToken,
  verificarAdmin,
  (req: AuthRequest, res) => {
    return res.json({
      mensaje: 'Acceso de administrador autorizado',
    });
  }
);

router.get(
  '/auxiliares',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const auxiliares = await prisma.usuario.findMany({
        where: {
          rol: 'AUXILIAR',
        },
        select: {
            id: true,
            nombreCompleto: true,
            codigoSiss: true,
            carnet: true,
            cargo: true,
            horarioInicio: true,
            horarioFin: true,
            activo: true,
            turnos: {
              select: {
                id: true,
                dia: true,
                horarioInicio: true,
                horarioFin: true,
              },
              orderBy: {
                id: 'asc',
              },
            },
          },
        orderBy: {
          nombreCompleto: 'asc',
        },
      });

      return res.json(auxiliares);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al obtener los auxiliares',
      });
    }
  }
);

router.post(
  '/auxiliares',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const {
        nombreCompleto,
        codigoSiss,
        carnet,
        cargo,
        turnos,
      } = req.body;

      if (
          !nombreCompleto ||
          !codigoSiss ||
          !carnet ||
          !cargo ||
          !Array.isArray(turnos) ||
          turnos.length === 0
        ) {
          return res.status(400).json({
            mensaje: 'Los datos del auxiliar y al menos un turno son obligatorios',
          });
        }

        const diasValidos = [
          'LUNES',
          'MARTES',
          'MIERCOLES',
          'JUEVES',
          'VIERNES',
          'SABADO',
        ];

        const turnosInvalidos = turnos.some(
          (turno: {
            dia: string;
            horarioInicio: string;
            horarioFin: string;
          }) =>
            !diasValidos.includes(turno.dia) ||
            !turno.horarioInicio ||
            !turno.horarioFin
        );

        if (turnosInvalidos) {
          return res.status(400).json({
            mensaje: 'Uno o más turnos contienen datos inválidos',
          });
        }

      const auxiliarExistente = await prisma.usuario.findFirst({
        where: {
          OR: [
            { codigoSiss },
            { carnet },
          ],
        },
      });

      if (auxiliarExistente) {
        return res.status(409).json({
          mensaje: 'El código SISS o carnet ya está registrado',
        });
      }

      const passwordHash = await bcrypt.hash(carnet, 10);

      const primerTurno = turnos[0];

      const auxiliar = await prisma.usuario.create({
        data: {
          nombreCompleto,
          codigoSiss,
          carnet,
          cargo,
          passwordHash,
          rol: 'AUXILIAR',

          // Compatibilidad temporal con el modelo anterior
          horarioInicio: primerTurno.horarioInicio,
          horarioFin: primerTurno.horarioFin,

          activo: true,

          turnos: {
            create: turnos.map(
              (turno: {
                dia: string;
                horarioInicio: string;
                horarioFin: string;
              }) => ({
                dia: turno.dia as DiaSemana,
                horarioInicio: turno.horarioInicio,
                horarioFin: turno.horarioFin,
              })
            ),
          },
        },
        select: {
          id: true,
          nombreCompleto: true,
          codigoSiss: true,
          carnet: true,
          cargo: true,
          horarioInicio: true,
          horarioFin: true,
          activo: true,
          turnos: {
            select: {
              id: true,
              dia: true,
              horarioInicio: true,
              horarioFin: true,
            },
            orderBy: {
              id: 'asc',
            },
          },
        },
      });

      return res.status(201).json(auxiliar);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al crear el auxiliar',
      });
    }
  }
);

router.put(
  '/auxiliares/:id',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: 'ID de auxiliar inválido',
        });
      }

      const {
        nombreCompleto,
        codigoSiss,
        carnet,
        cargo,
        turnos,
      } = req.body;

      if (
        !nombreCompleto ||
        !codigoSiss ||
        !carnet ||
        !cargo ||
        !Array.isArray(turnos) ||
        turnos.length === 0
      ) {
        return res.status(400).json({
          mensaje: 'Los datos del auxiliar y al menos un turno son obligatorios',
        });
      }

      const diasValidos = [
        'LUNES',
        'MARTES',
        'MIERCOLES',
        'JUEVES',
        'VIERNES',
        'SABADO',
      ];

      const turnosInvalidos = turnos.some(
        (turno: {
          dia: string;
          horarioInicio: string;
          horarioFin: string;
        }) =>
          !diasValidos.includes(turno.dia) ||
          !turno.horarioInicio ||
          !turno.horarioFin
      );

      if (turnosInvalidos) {
        return res.status(400).json({
          mensaje: 'Uno o más turnos contienen datos inválidos',
        });
      }

      const auxiliar = await prisma.usuario.findUnique({
        where: {
          id,
        },
      });

      if (!auxiliar || auxiliar.rol !== 'AUXILIAR') {
        return res.status(404).json({
          mensaje: 'Auxiliar no encontrado',
        });
      }

      const duplicado = await prisma.usuario.findFirst({
        where: {
          OR: [
            { codigoSiss },
            { carnet },
          ],
          NOT: {
            id,
          },
        },
      });

      if (duplicado) {
        return res.status(409).json({
          mensaje: 'El código SISS o carnet ya está registrado',
        });
      }

      const passwordHash = await bcrypt.hash(carnet, 10);
      const primerTurno = turnos[0];

      const auxiliarActualizado = await prisma.$transaction(async (tx) => {
        // Eliminamos la configuración anterior de turnos.
        await tx.turnoAuxiliar.deleteMany({
          where: {
            usuarioId: id,
          },
        });

        // Actualizamos los datos del auxiliar y creamos sus nuevos turnos.
        return tx.usuario.update({
          where: {
            id,
          },
          data: {
            nombreCompleto,
            codigoSiss,
            carnet,
            cargo,
            passwordHash,

            // Compatibilidad temporal con el modelo anterior.
            horarioInicio: primerTurno.horarioInicio,
            horarioFin: primerTurno.horarioFin,

            turnos: {
              create: turnos.map(
                (turno: {
                  dia: string;
                  horarioInicio: string;
                  horarioFin: string;
                }) => ({
                  dia: turno.dia as DiaSemana,
                  horarioInicio: turno.horarioInicio,
                  horarioFin: turno.horarioFin,
                })
              ),
            },
          },
          select: {
            id: true,
            nombreCompleto: true,
            codigoSiss: true,
            carnet: true,
            cargo: true,
            horarioInicio: true,
            horarioFin: true,
            activo: true,
            turnos: {
              select: {
                id: true,
                dia: true,
                horarioInicio: true,
                horarioFin: true,
              },
              orderBy: {
                id: 'asc',
              },
            },
          },
        });
      });

      return res.json(auxiliarActualizado);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al actualizar el auxiliar',
      });
    }
  }
);

router.patch(
  '/auxiliares/:id/estado',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: 'ID de auxiliar inválido',
        });
      }

      const { activo } = req.body;

      if (typeof activo !== 'boolean') {
        return res.status(400).json({
          mensaje: 'El campo activo debe ser booleano',
        });
      }

      const auxiliar = await prisma.usuario.findUnique({
        where: {
          id,
        },
      });

      if (!auxiliar || auxiliar.rol !== 'AUXILIAR') {
        return res.status(404).json({
          mensaje: 'Auxiliar no encontrado',
        });
      }

      const auxiliarActualizado = await prisma.usuario.update({
        where: {
          id,
        },
        data: {
          activo,
        },
        select: {
          id: true,
          nombreCompleto: true,
          codigoSiss: true,
          carnet: true,
          cargo: true,
          horarioInicio: true,
          horarioFin: true,
          activo: true,
        },
      });

      return res.json(auxiliarActualizado);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al cambiar el estado del auxiliar',
      });
    }
  }
);

router.get(
  '/docentes',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const docentes = await prisma.docente.findMany({
        orderBy: {
          nombreCompleto: 'asc',
        },
      });

      return res.json(docentes);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al obtener docentes',
      });
    }
  }
);

router.post(
  '/docentes',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { nombreCompleto } = req.body;

      if (!nombreCompleto) {
        return res.status(400).json({
          mensaje: 'El nombre completo es obligatorio',
        });
      }

      const docente = await prisma.docente.create({
        data: {
          nombreCompleto,
          activo: true,
        },
      });

      return res.status(201).json(docente);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al crear docente',
      });
    }
  }
);

router.put(
  '/docentes/:id',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: 'ID de docente inválido',
        });
      }

      const { nombreCompleto } = req.body;

      if (!nombreCompleto) {
        return res.status(400).json({
          mensaje: 'El nombre completo es obligatorio',
        });
      }

      const docente = await prisma.docente.findUnique({
        where: {
          id,
        },
      });

      if (!docente) {
        return res.status(404).json({
          mensaje: 'Docente no encontrado',
        });
      }

      const docenteActualizado = await prisma.docente.update({
        where: {
          id,
        },
        data: {
          nombreCompleto,
        },
      });

      return res.json(docenteActualizado);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al actualizar docente',
      });
    }
  }
);

router.patch(
  '/docentes/:id/estado',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: 'ID de docente inválido',
        });
      }

      const { activo } = req.body;

      if (typeof activo !== 'boolean') {
        return res.status(400).json({
          mensaje: 'El campo activo debe ser booleano',
        });
      }

      const docente = await prisma.docente.findUnique({
        where: {
          id,
        },
      });

      if (!docente) {
        return res.status(404).json({
          mensaje: 'Docente no encontrado',
        });
      }

      const docenteActualizado = await prisma.docente.update({
        where: {
          id,
        },
        data: {
          activo,
        },
      });

      return res.json(docenteActualizado);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al cambiar el estado del docente',
      });
    }
  }
);

router.get(
  '/salas',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const salas = await prisma.sala.findMany({
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
  }
);

router.post(
  '/salas',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { nombre } = req.body;

      if (!nombre) {
        return res.status(400).json({
          mensaje: 'El nombre de la sala es obligatorio',
        });
      }

      const salaExistente = await prisma.sala.findUnique({
        where: {
          nombre,
        },
      });

      if (salaExistente) {
        return res.status(409).json({
          mensaje: 'La sala ya está registrada',
        });
      }

      const sala = await prisma.sala.create({
        data: {
          nombre,
          activo: true,
        },
      });

      return res.status(201).json(sala);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al crear sala',
      });
    }
  }
);

router.put(
  '/salas/:id',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: 'ID de sala inválido',
        });
      }

      const { nombre } = req.body;

      if (!nombre) {
        return res.status(400).json({
          mensaje: 'El nombre de la sala es obligatorio',
        });
      }

      const sala = await prisma.sala.findUnique({
        where: {
          id,
        },
      });

      if (!sala) {
        return res.status(404).json({
          mensaje: 'Sala no encontrada',
        });
      }

      const duplicada = await prisma.sala.findFirst({
        where: {
          nombre,
          NOT: {
            id,
          },
        },
      });

      if (duplicada) {
        return res.status(409).json({
          mensaje: 'La sala ya está registrada',
        });
      }

      const salaActualizada = await prisma.sala.update({
        where: {
          id,
        },
        data: {
          nombre,
        },
      });

      return res.json(salaActualizada);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al actualizar sala',
      });
    }
  }
);

router.patch(
  '/salas/:id/estado',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: 'ID de sala inválido',
        });
      }

      const { activo } = req.body;

      if (typeof activo !== 'boolean') {
        return res.status(400).json({
          mensaje: 'El campo activo debe ser booleano',
        });
      }

      const sala = await prisma.sala.findUnique({
        where: {
          id,
        },
      });

      if (!sala) {
        return res.status(404).json({
          mensaje: 'Sala no encontrada',
        });
      }

      const salaActualizada = await prisma.sala.update({
        where: {
          id,
        },
        data: {
          activo,
        },
      });

      return res.json(salaActualizada);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al cambiar el estado de la sala',
      });
    }
  }
);

// ==================== MATERIAS ====================

// Obtener todas las materias
router.get(
  '/materias',
  verificarToken,
  verificarAdmin,
  async (_req: AuthRequest, res) => {
    try {
      const materias = await prisma.materia.findMany({
        orderBy: {
          nombre: 'asc',
        },
      });

      return res.json(materias);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al obtener materias',
      });
    }
  }
);

// Crear materia
router.post(
  '/materias',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { codigo, nombre } = req.body;

      if (!nombre?.trim()) {
        return res.status(400).json({
          mensaje: 'El nombre de la materia es obligatorio',
        });
      }

      const materia = await prisma.materia.create({
        data: {
          codigo: codigo?.trim() || null,
          nombre: nombre.trim(),
          activo: true,
        },
      });

      return res.status(201).json(materia);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al crear materia',
      });
    }
  }
);

// Editar materia
router.put(
  '/materias/:id',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: 'ID de materia inválido',
        });
      }

      const { codigo, nombre } = req.body;

      if (!nombre?.trim()) {
        return res.status(400).json({
          mensaje: 'El nombre de la materia es obligatorio',
        });
      }

      const materia = await prisma.materia.findUnique({
        where: {
          id,
        },
      });

      if (!materia) {
        return res.status(404).json({
          mensaje: 'Materia no encontrada',
        });
      }

      const materiaActualizada = await prisma.materia.update({
        where: {
          id,
        },
        data: {
          codigo: codigo?.trim() || null,
          nombre: nombre.trim(),
        },
      });

      return res.json(materiaActualizada);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al actualizar materia',
      });
    }
  }
);

// Activar o desactivar materia
router.patch(
  '/materias/:id/estado',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: 'ID de materia inválido',
        });
      }

      const { activo } = req.body;

      if (typeof activo !== 'boolean') {
        return res.status(400).json({
          mensaje: 'El campo activo debe ser booleano',
        });
      }

      const materia = await prisma.materia.findUnique({
        where: {
          id,
        },
      });

      if (!materia) {
        return res.status(404).json({
          mensaje: 'Materia no encontrada',
        });
      }

      const materiaActualizada = await prisma.materia.update({
        where: {
          id,
        },
        data: {
          activo,
        },
      });

      return res.json(materiaActualizada);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al cambiar el estado de la materia',
      });
    }
  }
);

router.get(
  '/informes',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const {auxiliarId, fecha, mes, anio, fechaDesde, fechaHasta,} = req.query;

      const where: any = {};

      // FILTRO POR AUXILIAR
      if (auxiliarId) {
        const id = Number(auxiliarId);

        if (isNaN(id)) {
          return res.status(400).json({
            mensaje: 'ID de auxiliar inválido',
          });
        }

        where.usuarioId = id;
      }

      // FILTRO POR FECHA
      if (fecha) {
        const fechaInicio = new Date(`${fecha}T00:00:00.000Z`);
        const fechaFin = new Date(`${fecha}T23:59:59.999Z`);

        if (isNaN(fechaInicio.getTime())) {
          return res.status(400).json({
            mensaje: 'Fecha inválida',
          });
        }

        where.fecha = {
          gte: fechaInicio,
          lte: fechaFin,
        };
      }

      // FILTRO POR RANGO DE FECHAS
      if (fechaDesde || fechaHasta) {
        if (!fechaDesde || !fechaHasta) {
          return res.status(400).json({
            mensaje: 'Debe indicar la fecha inicial y la fecha final',
          });
        }

        const inicio = new Date(`${fechaDesde}T00:00:00.000Z`);

        // Usamos el día siguiente como límite exclusivo.
        // Así incluimos completamente la fecha final.
        const finExclusivo = new Date(`${fechaHasta}T00:00:00.000Z`);
        finExclusivo.setUTCDate(finExclusivo.getUTCDate() + 1);

        if (
          isNaN(inicio.getTime()) ||
          isNaN(finExclusivo.getTime())
        ) {
          return res.status(400).json({
            mensaje: 'Rango de fechas inválido',
          });
        }

        if (inicio >= finExclusivo) {
          return res.status(400).json({
            mensaje: 'La fecha inicial no puede ser posterior a la fecha final',
          });
        }

        where.fecha = {
          gte: inicio,
          lt: finExclusivo,
        };
      }

      // FILTRO POR MES Y AÑO
if (mes && anio) {
  const mesNumero = Number(mes);
  const anioNumero = Number(anio);

  if (
    isNaN(mesNumero) ||
    isNaN(anioNumero) ||
    mesNumero < 1 ||
    mesNumero > 12
  ) {
    return res.status(400).json({
      mensaje: 'Mes o año inválido',
    });
  }

  const fechaInicio = new Date(
    Date.UTC(anioNumero, mesNumero - 1, 1)
  );

  const fechaFin = new Date(
    Date.UTC(anioNumero, mesNumero, 1)
  );

  where.fecha = {
    gte: fechaInicio,
    lt: fechaFin,
  };
}

// FILTRO SOLO POR AÑO
if (anio && !mes) {
  const anioNumero = Number(anio);

  if (isNaN(anioNumero)) {
    return res.status(400).json({
      mensaje: 'Año inválido',
    });
  }

  const fechaInicio = new Date(
    Date.UTC(anioNumero, 0, 1)
  );

  const fechaFin = new Date(
    Date.UTC(anioNumero + 1, 0, 1)
  );

  where.fecha = {
    gte: fechaInicio,
    lt: fechaFin,
  };
}

// FILTRO SEMANAL PARA UN AUXILIAR
if (
  auxiliarId &&
  !fecha &&
  !mes &&
  !anio &&
  !fechaDesde &&
  !fechaHasta
) {
  const partesFecha = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/La_Paz',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const anioActual = Number(
    partesFecha.find((parte) => parte.type === 'year')?.value
  );

  const mesActual = Number(
    partesFecha.find((parte) => parte.type === 'month')?.value
  );

  const diaActual = Number(
    partesFecha.find((parte) => parte.type === 'day')?.value
  );

  const fechaActual = new Date(
    Date.UTC(anioActual, mesActual - 1, diaActual)
  );

  const diaSemana = fechaActual.getUTCDay();

  // Calculamos el lunes de la semana actual
  const diasDesdeLunes = diaSemana === 0 ? 6 : diaSemana - 1;

  const lunes = new Date(fechaActual);
  lunes.setUTCDate(lunes.getUTCDate() - diasDesdeLunes);

  // El domingo marca el límite exclusivo
  const domingo = new Date(lunes);
  domingo.setUTCDate(domingo.getUTCDate() + 6);

  where.fecha = {
    gte: lunes,
    lt: domingo,
  };
}

      const informes = await prisma.informe.findMany({
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nombreCompleto: true,
              codigoSiss: true,
            },
          },
        },
        orderBy: {
          fecha: 'desc',
        },
      });

      return res.json(informes);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al obtener los informes',
      });
    }
  }
);

router.get(
  '/informes/:id',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: 'ID de informe inválido',
        });
      }

      const informe = await prisma.informe.findUnique({
        where: {
          id,
        },
        include: {
  usuario: {
    select: {
      id: true,
      codigoSiss: true,
      username: true,
      nombreCompleto: true,
      cargo: true,
      rol: true,
      horarioInicio: true,
      horarioFin: true,
      activo: true,
    },
  },

          actividadesAcademicas: {
            include: {
              docente: true,
              materia: true,
            },
          },

          actividadesLaboratorio: true,

          incidencias: true,

          pendientes: true,
        },
      });

      if (!informe) {
        return res.status(404).json({
          mensaje: 'Informe no encontrado',
        });
      }

      return res.json(informe);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al obtener el detalle del informe',
      });
    }
  }
);

router.get(
  '/dashboard',
  verificarToken,
  verificarAdmin,
  async (req: AuthRequest, res) => {
    try {
      const informesRecientes = await prisma.informe.findMany({
        take: 5,
        include: {
          usuario: {
            select: {
              id: true,
              nombreCompleto: true,
              codigoSiss: true,
            },
          },
        },
        orderBy: {
          fecha: 'desc',
        },
      });

      const totalInformes = await prisma.informe.count();

      const totalAuxiliares = await prisma.usuario.count({
        where: {
          rol: 'AUXILIAR',
        },
      });

      const auxiliaresActivos = await prisma.usuario.count({
        where: {
          rol: 'AUXILIAR',
          activo: true,
        },
      });

      const totalDocentes = await prisma.docente.count({
        where: {
          activo: true,
        },
      });

      const totalSalas = await prisma.sala.count({
        where: {
          activo: true,
        },
      });

      return res.json({
        resumen: {
          totalInformes,
          totalAuxiliares,
          auxiliaresActivos,
          totalDocentes,
          totalSalas,
        },
        informesRecientes,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error al obtener datos del dashboard',
      });
    }
  }
);

export default router;