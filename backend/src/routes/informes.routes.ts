import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { verificarToken, AuthRequest } from '../middlewares/auth.middleware';

const obtenerFechaBolivia = (): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/La_Paz',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
};

const router = Router();

router.get('/', verificarToken, async (req: AuthRequest, res) => {
  try {
    const usuarioId = req.usuario?.usuarioId;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'Usuario no identificado',
      });
    }

    const informes = await prisma.informe.findMany({
      where: {
        usuarioId,
      },
      orderBy: {
        fecha: 'desc',
      },
      select: {
        id: true,
        fecha: true,
        horarioInicio: true,
        horarioFin: true,
        horarioModificado: true,
        estado: true,
        estadoRecomendacion: true,
        createdAt: true,

        _count: {
          select: {
            actividadesAcademicas: true,
            actividadesLaboratorio: true,
            incidencias: true,
            pendientes: true,
          },
        },
      },
    });

    const informesFormateados = informes.map((informe) => ({
        ...informe,
        fecha: informe.fecha.toISOString().split('T')[0],
    }));

return res.json(informesFormateados);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: 'Error al obtener los informes',
    });
  }
});

router.get('/:id', verificarToken, async (req: AuthRequest, res) => {
  try {
    const usuarioId = req.usuario?.usuarioId;
    const id = Number(req.params.id);

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'Usuario no identificado',
      });
    }

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: 'ID de informe inválido',
      });
    }

    const informe = await prisma.informe.findFirst({
      where: {
        id,
        usuarioId,
      },
      include: {
        usuario: {
          select: {
            id: true,
            codigoSiss: true,
            nombreCompleto: true,
            cargo: true,
          },
        },

        actividadesAcademicas: {
          include: {
            docente: true,
            materia: true,
          },
          orderBy: {
            id: 'asc',
          },
        },

        actividadesLaboratorio: {
          orderBy: {
            orden: 'asc',
          },
        },

        incidencias: {
          orderBy: {
            id: 'asc',
          },
        },

        pendientes: {
          orderBy: {
            orden: 'asc',
          },
        },
      },
    });

    if (!informe) {
      return res.status(404).json({
        mensaje: 'Informe no encontrado',
      });
    }

    const informeFormateado = {
        ...informe,
        fecha: informe.fecha.toISOString().split('T')[0],
    };

    return res.json(informeFormateado);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: 'Error al obtener el informe',
    });
  }
});

router.put('/:id', verificarToken, async (req: AuthRequest, res) => {
  try {
    const usuarioId = req.usuario?.usuarioId;
    const id = Number(req.params.id);

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'Usuario no identificado',
      });
    }

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: 'ID de informe inválido',
      });
    }

    const {
      horarioInicio,
      horarioFin,
      horarioModificado = false,
      actividadesAcademicas = [],
      actividadesLaboratorio = [],
      incidencias = [],
      pendientes = [],
      estadoRecomendacion = null,
    } = req.body ?? {};

    if (!horarioInicio || !horarioFin) {
      return res.status(400).json({
        mensaje: 'El horario del turno es obligatorio',
      });
    }

    if (
      !Array.isArray(actividadesLaboratorio) ||
      actividadesLaboratorio.length === 0
    ) {
      return res.status(400).json({
        mensaje: 'Debe registrar al menos una actividad de laboratorio',
      });
    }

    for (const actividad of actividadesLaboratorio) {
  if (typeof actividad !== 'string' || !actividad.trim()) {
    return res.status(400).json({
      mensaje: 'Las actividades de laboratorio no pueden estar vacías',
    });
  }
}

for (const incidencia of incidencias) {
  if (!incidencia.equipo?.trim()) {
    return res.status(400).json({
      mensaje: 'El equipo es obligatorio en las incidencias',
    });
  }

  if (!incidencia.descripcion?.trim()) {
    return res.status(400).json({
      mensaje: 'La descripción es obligatoria en las incidencias',
    });
  }

  if (!incidencia.accion?.trim()) {
    return res.status(400).json({
      mensaje: 'La acción es obligatoria en las incidencias',
    });
  }
}

for (const pendiente of pendientes) {
  if (typeof pendiente !== 'string' || !pendiente.trim()) {
    return res.status(400).json({
      mensaje: 'Los pendientes no pueden estar vacíos',
    });
  }
}

for (const actividad of actividadesAcademicas) {
  if (!actividad.sala?.trim()) {
    return res.status(400).json({
      mensaje: 'La sala es obligatoria en las actividades académicas',
    });
  }

  if (!actividad.horarioInicio?.trim() || !actividad.horarioFin?.trim()) {
    return res.status(400).json({
      mensaje: 'El horario es obligatorio en las actividades académicas',
    });
  }

  if (
    actividad.docenteId != null &&
    actividad.docenteOtro?.trim()
  ) {
    return res.status(400).json({
      mensaje:
        'No puede seleccionar un docente y registrar otro docente al mismo tiempo',
    });
  }

  if (
    actividad.materiaId != null &&
    actividad.materiaOtra?.trim()
  ) {
    return res.status(400).json({
      mensaje:
        'No puede seleccionar una materia y registrar otra materia al mismo tiempo',
    });
  }

  if (
    actividad.docenteId == null &&
    !actividad.docenteOtro?.trim()
  ) {
    return res.status(400).json({
      mensaje: 'Debe seleccionar un docente o registrar otro docente',
    });
  }

  if (
    actividad.materiaId == null &&
    !actividad.materiaOtra?.trim()
  ) {
    return res.status(400).json({
      mensaje: 'Debe seleccionar una materia o registrar otra materia',
    });
  }
}

    // Verificar que el informe pertenece al usuario
    const informeExistente = await prisma.informe.findFirst({
      where: {
        id,
        usuarioId,
      },
    });

    if (!informeExistente) {
      return res.status(404).json({
        mensaje: 'Informe no encontrado',
      });
    }

    // Actualizamos todo dentro de una transacción
    const informe = await prisma.$transaction(async (tx) => {
      // Eliminar los detalles anteriores
      await tx.actividadAcademica.deleteMany({
        where: {
          informeId: id,
        },
      });

      await tx.actividadLaboratorio.deleteMany({
        where: {
          informeId: id,
        },
      });

      await tx.incidencia.deleteMany({
        where: {
          informeId: id,
        },
      });

      await tx.pendiente.deleteMany({
        where: {
          informeId: id,
        },
      });

      // Crear nuevamente los detalles y actualizar el informe
      return tx.informe.update({
        where: {
          id,
        },

        data: {
          horarioInicio,
          horarioFin,
          horarioModificado,
          estadoRecomendacion,

          actividadesAcademicas: {
            create: actividadesAcademicas.map((actividad: any) => ({
              docenteId: actividad.docenteId ?? null,
              docenteOtro: actividad.docenteOtro ?? null,
              materiaId: actividad.materiaId ?? null,
              materiaOtra: actividad.materiaOtra ?? null,
              sala: actividad.sala,
              horarioInicio: actividad.horarioInicio,
              horarioFin: actividad.horarioFin,
              observaciones: actividad.observaciones ?? null,
            })),
          },

          actividadesLaboratorio: {
            create: actividadesLaboratorio.map(
              (descripcion: string, index: number) => ({
                descripcion,
                orden: index + 1,
              })
            ),
          },

          incidencias: {
            create: incidencias.map((incidencia: any) => ({
              equipo: incidencia.equipo,
              descripcion: incidencia.descripcion,
              accion: incidencia.accion,
            })),
          },

          pendientes: {
            create: pendientes.map((descripcion: string, index: number) => ({
              descripcion,
              orden: index + 1,
            })),
          },
        },

        include: {
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
    });

    const informeFormateado = {
        ...informe,
        fecha: informe.fecha.toISOString().split('T')[0],
    };

    return res.json({
        mensaje: 'Informe actualizado correctamente',
        informe: informeFormateado,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: 'Error al actualizar el informe',
    });
  }
});

router.post('/', verificarToken, async (req: AuthRequest, res) => {
  try {
    const usuarioId = req.usuario?.usuarioId;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'Usuario no identificado',
      });
    }

    const {
      horarioInicio,
      horarioFin,
      horarioModificado = false,
      actividadesAcademicas = [],
      actividadesLaboratorio = [],
      incidencias = [],
      pendientes = [],
      estadoRecomendacion = null,
    } = req.body ?? {};

    // Validaciones básicas
    if (!horarioInicio || !horarioFin) {
      return res.status(400).json({
        mensaje: 'El horario del turno es obligatorio',
      });
    }

    if (
      !Array.isArray(actividadesLaboratorio) ||
      actividadesLaboratorio.length === 0
    ) {
      return res.status(400).json({
        mensaje: 'Debe registrar al menos una actividad de laboratorio',
      });
    }

    for (const actividad of actividadesLaboratorio) {
  if (typeof actividad !== 'string' || !actividad.trim()) {
    return res.status(400).json({
      mensaje: 'Las actividades de laboratorio no pueden estar vacías',
    });
  }
}

for (const incidencia of incidencias) {
  if (!incidencia.equipo?.trim()) {
    return res.status(400).json({
      mensaje: 'El equipo es obligatorio en las incidencias',
    });
  }

  if (!incidencia.descripcion?.trim()) {
    return res.status(400).json({
      mensaje: 'La descripción es obligatoria en las incidencias',
    });
  }

  if (!incidencia.accion?.trim()) {
    return res.status(400).json({
      mensaje: 'La acción es obligatoria en las incidencias',
    });
  }
}

for (const pendiente of pendientes) {
  if (typeof pendiente !== 'string' || !pendiente.trim()) {
    return res.status(400).json({
      mensaje: 'Los pendientes no pueden estar vacíos',
    });
  }
}

    for (const actividad of actividadesAcademicas) {
  if (!actividad.sala || !actividad.sala.trim()) {
    return res.status(400).json({
      mensaje: 'La sala es obligatoria en cada actividad académica',
    });
  }

  if (
    !actividad.horarioInicio ||
    !actividad.horarioFin ||
    !actividad.horarioInicio.trim() ||
    !actividad.horarioFin.trim()
  ) {
    return res.status(400).json({
      mensaje: 'El horario es obligatorio en cada actividad académica',
    });
  }

  if (
    actividad.docenteId != null &&
    actividad.docenteOtro &&
    actividad.docenteOtro.trim()
  ) {
    return res.status(400).json({
      mensaje: 'No puede seleccionar un docente y escribir otro docente',
    });
  }

  if (
    actividad.materiaId != null &&
    actividad.materiaOtra &&
    actividad.materiaOtra.trim()
  ) {
    return res.status(400).json({
      mensaje: 'No puede seleccionar una materia y escribir otra materia',
    });
  }

  if (
    actividad.docenteId == null &&
    (!actividad.docenteOtro || !actividad.docenteOtro.trim())
  ) {
    return res.status(400).json({
      mensaje: 'Debe seleccionar un docente o escribir otro docente',
    });
  }

  if (
    actividad.materiaId == null &&
    (!actividad.materiaOtra || !actividad.materiaOtra.trim())
  ) {
    return res.status(400).json({
      mensaje: 'Debe seleccionar una materia o escribir otra materia',
    });
  }
}

    // Fecha actual del servidor
    const fecha = new Date(`${obtenerFechaBolivia()}T00:00:00-04:00`);

    // Crear informe y todos sus elementos relacionados
    const informe = await prisma.informe.create({
      data: {
        usuarioId,
        fecha,
        horarioInicio,
        horarioFin,
        horarioModificado,
        estado: 'GUARDADO',
        estadoRecomendacion,

        actividadesAcademicas: {
          create: actividadesAcademicas.map((actividad: any) => ({
            docenteId: actividad.docenteId ?? null,
            docenteOtro: actividad.docenteOtro ?? null,
            materiaId: actividad.materiaId ?? null,
            materiaOtra: actividad.materiaOtra ?? null,
            sala: actividad.sala,
            horarioInicio: actividad.horarioInicio,
            horarioFin: actividad.horarioFin,
            observaciones: actividad.observaciones ?? null,
          })),
        },

        actividadesLaboratorio: {
          create: actividadesLaboratorio.map(
            (descripcion: string, index: number) => ({
              descripcion,
              orden: index + 1,
            })
          ),
        },

        incidencias: {
          create: incidencias.map((incidencia: any) => ({
            equipo: incidencia.equipo,
            descripcion: incidencia.descripcion,
            accion: incidencia.accion,
          })),
        },

        pendientes: {
          create: pendientes.map((descripcion: string, index: number) => ({
            descripcion,
            orden: index + 1,
          })),
        },
      },

      include: {
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

    const informeFormateado = {
        ...informe,
        fecha: informe.fecha.toISOString().split('T')[0],
    };

    return res.status(201).json({
        mensaje: 'Informe guardado correctamente',
        informe: informeFormateado,
    });
  } catch (error: any) {
    console.error(error);

    // Informe duplicado para el mismo usuario y fecha
    if (error.code === 'P2002') {
      return res.status(409).json({
        mensaje: 'Ya existe un informe para este día',
      });
    }

    return res.status(500).json({
      mensaje: 'Error al guardar el informe',
    });
  }
});

export default router;