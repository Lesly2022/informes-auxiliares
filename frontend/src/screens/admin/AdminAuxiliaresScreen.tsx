import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import type { AdminScreen } from '../../types';
import {
  obtenerAdminAuxiliares,
  crearAdminAuxiliar,
  actualizarAdminAuxiliar,
  cambiarEstadoAdminAuxiliar,
  type AdminAuxiliar,
  type AdminAuxiliarFormulario,
} from '../../services/admin.service';

interface Props {
  onNavigate: (screen: AdminScreen) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

const formularioVacio: AdminAuxiliarFormulario = {
  nombreCompleto: '',
  codigoSiss: '',
  carnet: '',
  cargo: 'Auxiliar de Laboratorio de Cómputo',
  turnos: [],
};

const DIAS_SEMANA = [
  { valor: 'LUNES', etiqueta: 'Lunes' },
  { valor: 'MARTES', etiqueta: 'Martes' },
  { valor: 'MIERCOLES', etiqueta: 'Miércoles' },
  { valor: 'JUEVES', etiqueta: 'Jueves' },
  { valor: 'VIERNES', etiqueta: 'Viernes' },
  { valor: 'SABADO', etiqueta: 'Sábado' },
] as const;

const CARGOS_AUXILIAR = [
  'Administrador de Lab. de Cómputo',
  'Auxiliar de Terminal de Cómputo',
  'Administrador de Lab. de Desarrollo',
  'Auxiliar de Lab. de Desarrollo',
  'Administrador de Lab. de Mantenimiento de Software',
  'Auxiliar de Lab. de Mantenimiento de Software',
  'Administrador de Lab. de Mantenimiento de Hardware',
  'Auxiliar de Lab. de Mantenimiento de Hardware',
] as const;

const ordenarTurnos = (
  turnos: AdminAuxiliarFormulario['turnos']
) => {
  const orden = DIAS_SEMANA.map((dia) => dia.valor);

  return [...turnos].sort(
    (a, b) =>
      orden.indexOf(a.dia) - orden.indexOf(b.dia)
  );
};

const obtenerTurnosAgrupados = (auxiliar: AdminAuxiliar) => {
  const turnos = ordenarTurnos(
    auxiliar.turnos && auxiliar.turnos.length > 0
      ? auxiliar.turnos
      : DIAS_SEMANA.map((dia) => ({
          dia: dia.valor,
          horarioInicio: auxiliar.horarioInicio,
          horarioFin: auxiliar.horarioFin,
        }))
  );

  const grupos = new Map<
    string,
    {
      dias: string[];
      horarioInicio: string;
      horarioFin: string;
    }
  >();

  turnos.forEach((turno) => {
    const clave = `${turno.horarioInicio}-${turno.horarioFin}`;

    const grupo = grupos.get(clave);

    if (grupo) {
      grupo.dias.push(turno.dia);
    } else {
      grupos.set(clave, {
        dias: [turno.dia],
        horarioInicio: turno.horarioInicio,
        horarioFin: turno.horarioFin,
      });
    }
  });

  return Array.from(grupos.values()).map((grupo) => {
    const indices = grupo.dias
      .map((dia) =>
        DIAS_SEMANA.findIndex((item) => item.valor === dia)
      )
      .sort((a, b) => a - b);

    const sonConsecutivos = indices.every(
      (indice, posicion) =>
        posicion === 0 ||
        indice === indices[posicion - 1] + 1
    );

    let textoDias = '';

    if (indices.length > 1 && sonConsecutivos) {
      const primero = DIAS_SEMANA[indices[0]].etiqueta;
      const ultimo =
        DIAS_SEMANA[indices[indices.length - 1]].etiqueta;

      textoDias = `${primero} a ${ultimo}`;
    } else {
      textoDias = indices
        .map((indice) => DIAS_SEMANA[indice].etiqueta)
        .join(', ');
    }

    return {
      ...grupo,
      textoDias,
    };
  });
};

export default function AdminAuxiliaresScreen({
  onNavigate,
  onLogout,
}: Props) {
  const [auxiliares, setAuxiliares] = useState<AdminAuxiliar[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstadoId, setCambiandoEstadoId] =
    useState<number | null>(null);

  const [formulario, setFormulario] =
    useState<AdminAuxiliarFormulario>(formularioVacio);
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [nuevoHorarioInicio, setNuevoHorarioInicio] = useState('');
  const [nuevoHorarioFin, setNuevoHorarioFin] = useState('');
  const [diaEditandoTurno, setDiaEditandoTurno] = useState<string | null>(null);

  // ==========================================
  // CARGAR AUXILIARES REALES
  // ==========================================

  const cargarAuxiliares = async () => {
    try {
      setCargando(true);
      setMensaje('');

      const data = await obtenerAdminAuxiliares();
      setAuxiliares(data);
    } catch (err) {
      setMensaje(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los auxiliares'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAuxiliares();
  }, []);

  // ==========================================
  // BUSCADOR
  // ==========================================

  const auxiliaresFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return auxiliares;
    }

    return auxiliares.filter(
      (auxiliar) =>
        auxiliar.nombreCompleto.toLowerCase().includes(texto) ||
        auxiliar.codigoSiss.toLowerCase().includes(texto) ||
        auxiliar.carnet.toLowerCase().includes(texto)
    );
  }, [auxiliares, busqueda]);

  // ==========================================
  // FORMULARIO
  // ==========================================

  const abrirNuevoAuxiliar = () => {
    setFormulario(formularioVacio);
    setDiasSeleccionados([]);
    setNuevoHorarioInicio('');
    setNuevoHorarioFin('');
    setEditandoId(null);
    setMensaje('');
    setMensajeExito('');
    setMostrarFormulario(true);
  };

  const abrirEdicion = (auxiliar: AdminAuxiliar) => {
    setFormulario({
      nombreCompleto: auxiliar.nombreCompleto,
      codigoSiss: auxiliar.codigoSiss,
      carnet: auxiliar.carnet,
      cargo: auxiliar.cargo,

      // Si ya tiene turnos nuevos, utilizamos esos.
      // Si todavía no los tiene (como José), conservamos
      // temporalmente su horario anterior de lunes a sábado.
      turnos:
      auxiliar.turnos && auxiliar.turnos.length > 0
        ? ordenarTurnos(auxiliar.turnos)
        : DIAS_SEMANA.map((dia) => ({
            dia: dia.valor,
            horarioInicio: auxiliar.horarioInicio,
            horarioFin: auxiliar.horarioFin,
          })),
    });

    setEditandoId(auxiliar.id);
    setMensaje('');
    setMensajeExito('');
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    if (guardando) {
      return;
    }

    setMostrarFormulario(false);
    setEditandoId(null);
    setFormulario(formularioVacio);
    setDiasSeleccionados([]);
    setNuevoHorarioInicio('');
    setNuevoHorarioFin('');
    setMensaje('');
  };

  // ==========================================
  // GUARDAR / EDITAR
  // ==========================================

  const alternarDia = (dia: string) => {
    setDiasSeleccionados((actuales) =>
      actuales.includes(dia)
        ? actuales.filter((item) => item !== dia)
        : [...actuales, dia]
    );
  };

  const agregarTurnos = () => {
    setMensaje('');

    if (diasSeleccionados.length === 0) {
      setMensaje('Selecciona al menos un día.');
      return;
    }

    if (!nuevoHorarioInicio || !nuevoHorarioFin) {
      setMensaje('Completa la hora de inicio y finalización.');
      return;
    }

    if (nuevoHorarioInicio >= nuevoHorarioFin) {
      setMensaje('La hora de inicio debe ser anterior a la hora de finalización.');
      return;
    }

    const nuevosTurnos = diasSeleccionados.map((dia) => ({
      dia: dia as AdminAuxiliarFormulario['turnos'][number]['dia'],
      horarioInicio: nuevoHorarioInicio,
      horarioFin: nuevoHorarioFin,
    }));

    // Si alguno de esos días ya estaba configurado,
    // reemplazamos su horario en lugar de duplicarlo.
    const turnosSinDiasRepetidos = formulario.turnos.filter(
      (turno) => !diasSeleccionados.includes(turno.dia)
    );

    setFormulario({
      ...formulario,
      turnos: ordenarTurnos([
        ...turnosSinDiasRepetidos,
        ...nuevosTurnos,
      ]),
    });

    setDiasSeleccionados([]);
    setNuevoHorarioInicio('');
    setNuevoHorarioFin('');
  };

  const eliminarTurno = (dia: string) => {
    setFormulario({
      ...formulario,
      turnos: formulario.turnos.filter((turno) => turno.dia !== dia),
    });
  };

const editarTurno = (
  turno: AdminAuxiliarFormulario['turnos'][number]
) => {
  setDiaEditandoTurno(turno.dia);
  setDiasSeleccionados([turno.dia]);
  setNuevoHorarioInicio(turno.horarioInicio);
  setNuevoHorarioFin(turno.horarioFin);
  setMensaje('');
};

const guardarEdicionTurno = () => {
  setMensaje('');

  if (!diaEditandoTurno) {
    return;
  }

  if (!nuevoHorarioInicio || !nuevoHorarioFin) {
    setMensaje('Completa la hora de inicio y finalización.');
    return;
  }

  if (nuevoHorarioInicio >= nuevoHorarioFin) {
    setMensaje(
      'La hora de inicio debe ser anterior a la hora de finalización.'
    );
    return;
  }

  setFormulario({
    ...formulario,
    turnos: ordenarTurnos(
      formulario.turnos.map((turno) =>
        turno.dia === diaEditandoTurno
          ? {
              ...turno,
              horarioInicio: nuevoHorarioInicio,
              horarioFin: nuevoHorarioFin,
            }
          : turno
      )
    ),
  });

  setDiaEditandoTurno(null);
  setDiasSeleccionados([]);
  setNuevoHorarioInicio('');
  setNuevoHorarioFin('');
};

const cancelarEdicionTurno = () => {
  setDiaEditandoTurno(null);
  setDiasSeleccionados([]);
  setNuevoHorarioInicio('');
  setNuevoHorarioFin('');
  setMensaje('');
};

  const guardarAuxiliar = async (e: React.FormEvent) => {
  e.preventDefault();

  setMensaje('');
  setMensajeExito('');
  if (diaEditandoTurno) {
  setMensaje(
    'Tienes un turno en edición. Guarda o cancela los cambios del turno antes de guardar el auxiliar.'
  );
  return;
}

  const datos: AdminAuxiliarFormulario = {
    nombreCompleto: formulario.nombreCompleto.trim(),
    codigoSiss: formulario.codigoSiss.trim(),
    carnet: formulario.carnet.trim(),
    cargo: formulario.cargo.trim(),
    turnos: formulario.turnos,
  };

  if (
    !datos.nombreCompleto ||
    !datos.codigoSiss ||
    !datos.carnet ||
    !datos.cargo
  ) {
    setMensaje('Completa todos los campos obligatorios.');
    return;
  }

  if (datos.turnos.length === 0) {
    setMensaje('Debes registrar al menos un turno para el auxiliar.');
    return;
  }

  const existeTurnoInvalido = datos.turnos.some(
    (turno) =>
      !turno.horarioInicio ||
      !turno.horarioFin ||
      turno.horarioInicio >= turno.horarioFin
  );

  if (existeTurnoInvalido) {
    setMensaje('Revisa los horarios configurados.');
    return;
  }

  try {
    setGuardando(true);

    if (editandoId !== null) {
      const actualizado = await actualizarAdminAuxiliar(
        editandoId,
        datos
      );

      setAuxiliares((actuales) =>
        actuales.map((auxiliar) =>
          auxiliar.id === actualizado.id ? actualizado : auxiliar
        )
      );

      setMensajeExito('Auxiliar actualizado correctamente.');
    } else {
      const nuevo = await crearAdminAuxiliar(datos);

      setAuxiliares((actuales) =>
        [...actuales, nuevo].sort((a, b) =>
          a.nombreCompleto.localeCompare(b.nombreCompleto)
        )
      );

      setMensajeExito('Auxiliar registrado correctamente.');
    }

    setMostrarFormulario(false);
    setEditandoId(null);
    setFormulario(formularioVacio);
    setDiasSeleccionados([]);
    setNuevoHorarioInicio('');
    setNuevoHorarioFin('');
    setDiaEditandoTurno(null);
  } catch (err) {
    setMensaje(
      err instanceof Error
        ? err.message
        : 'No se pudo guardar el auxiliar'
    );
  } finally {
    setGuardando(false);
  }
};

  // ==========================================
  // ACTIVAR / DESACTIVAR
  // ==========================================

  const cambiarEstado = async (auxiliar: AdminAuxiliar) => {
    const nuevoEstado = !auxiliar.activo;

    try {
      setCambiandoEstadoId(auxiliar.id);
      setMensaje('');
      setMensajeExito('');

      const actualizado = await cambiarEstadoAdminAuxiliar(
        auxiliar.id,
        nuevoEstado
      );

      setAuxiliares((actuales) =>
        actuales.map((item) =>
          item.id === actualizado.id ? actualizado : item
        )
      );

      setMensajeExito(
        nuevoEstado
          ? 'Auxiliar activado correctamente.'
          : 'Auxiliar desactivado correctamente.'
      );
    } catch (err) {
      setMensaje(
        err instanceof Error
          ? err.message
          : 'No se pudo cambiar el estado del auxiliar'
      );
    } finally {
      setCambiandoEstadoId(null);
    }
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    border: '1.5px solid #cdd5e0',
    backgroundColor: '#f8fafc',
    color: '#111827',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <AdminSidebar
        active="admin-auxiliares"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main
        className="flex-1 flex flex-col min-w-0"
        style={{ backgroundColor: '#f1f4f9' }}
      >
        {/* ENCABEZADO */}
        <header
          className="flex items-center justify-between px-8 py-4 border-b"
          style={{
            backgroundColor: 'white',
            borderColor: '#e2e8f0',
          }}
        >
          <div>
            <h1
              className="font-semibold text-base"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#111827',
              }}
            >
              Gestión de auxiliares
            </h1>

            <p
              className="text-xs mt-0.5"
              style={{ color: '#5a6a82' }}
            >
              Registra y administra los auxiliares del laboratorio.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirNuevoAuxiliar}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`,
              boxShadow: '0 2px 8px rgba(37,84,168,0.28)',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            Nuevo auxiliar
          </button>
        </header>

        <div className="flex-1 px-8 py-6">
          {/* MENSAJE DE ÉXITO */}
          {mensajeExito && (
            <div
              className="rounded-lg px-4 py-3 text-sm mb-5"
              style={{
                backgroundColor: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
              }}
            >
              {mensajeExito}
            </div>
          )}

          {/* ERROR GENERAL */}
          {mensaje && !mostrarFormulario && (
            <div
              className="rounded-lg px-4 py-3 text-sm mb-5"
              style={{
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
              }}
            >
              {mensaje}
            </div>
          )}

          {/* RESUMEN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <Resumen
              titulo="Total de auxiliares"
              valor={auxiliares.length}
            />

            <Resumen
              titulo="Activos"
              valor={
                auxiliares.filter((auxiliar) => auxiliar.activo)
                  .length
              }
            />

            <Resumen
              titulo="Inactivos"
              valor={
                auxiliares.filter((auxiliar) => !auxiliar.activo)
                  .length
              }
            />
          </div>

          {/* BUSCADOR */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <label
              className="text-xs font-medium block mb-1"
              style={{ color: '#5a6a82' }}
            >
              Buscar auxiliar
            </label>

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre, Código SISS o Carnet..."
              style={{
                ...inputBase,
                maxWidth: 450,
              }}
            />
          </div>

          {/* TABLA */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div
              className="px-5 py-4 border-b"
              style={{ borderColor: '#e2e8f0' }}
            >
              <h2
                className="text-sm font-semibold"
                style={{ color: '#111827' }}
              >
                Auxiliares registrados
              </h2>

              <p
                className="text-xs mt-0.5"
                style={{ color: '#8fa0b8' }}
              >
                {cargando
                  ? 'Cargando auxiliares...'
                  : `${auxiliaresFiltrados.length} ${
                      auxiliaresFiltrados.length === 1
                        ? 'auxiliar encontrado'
                        : 'auxiliares encontrados'
                    }`}
              </p>
            </div>

            {cargando ? (
              <div className="text-center px-5 py-14">
                <div
                  className="rounded-full mx-auto mb-3"
                  style={{
                    width: 30,
                    height: 30,
                    border: '3px solid #e2e8f0',
                    borderTopColor: B_DARK,
                    animation: 'spin 0.8s linear infinite',
                  }}
                />

                <p
                  className="text-sm"
                  style={{ color: '#8fa0b8' }}
                >
                  Cargando auxiliares...
                </p>

                <style>
                  {`
                    @keyframes spin {
                      to {
                        transform: rotate(360deg);
                      }
                    }
                  `}
                </style>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {[
                        'Auxiliar',
                        'Código SISS',
                        'Turnos',
                        'Estado',
                        'Acciones',
                      ].map((columna) => (
                        <th
                          key={columna}
                          className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                          style={{
                            color: '#8fa0b8',
                            backgroundColor: '#fafbfd',
                            fontSize: 11,
                            borderBottom: '1px solid #e2e8f0',
                          }}
                        >
                          {columna}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {auxiliaresFiltrados.map(
                      (auxiliar, index) => (
                        <tr
                          key={auxiliar.id}
                          style={{
                            borderBottom:
                              index <
                              auxiliaresFiltrados.length - 1
                                ? '1px solid #f0f4fb'
                                : 'none',
                          }}
                        >
                          {/* AUXILIAR */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                                style={{
                                  width: 36,
                                  height: 36,
                                  backgroundColor: B_LIGHT,
                                  color: B_DARK,
                                }}
                              >
                                {auxiliar.nombreCompleto
                                  .split(' ')
                                  .slice(0, 2)
                                  .map((nombre) =>
                                    nombre.charAt(0)
                                  )
                                  .join('')}
                              </div>

                              <div>
                                <div
                                  className="text-sm font-medium"
                                  style={{ color: '#111827' }}
                                >
                                  {auxiliar.nombreCompleto}
                                </div>

                                <div
                                  className="text-xs mt-0.5"
                                  style={{ color: '#8fa0b8' }}
                                >
                                  {auxiliar.cargo}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* SISS */}
                          <td className="px-5 py-4">
                            <div
                              className="text-sm font-medium"
                              style={{ color: '#111827' }}
                            >
                              {auxiliar.codigoSiss}
                            </div>

                            <div
                              className="text-xs mt-0.5"
                              style={{ color: '#8fa0b8' }}
                            >
                              Usuario de acceso
                            </div>
                          </td>

                          {/* TURNOS */}
                          <td
                            className="px-5 py-4"
                            style={{ color: '#536076' }}
                          >
                            <div className="flex flex-col gap-1">
                              {obtenerTurnosAgrupados(auxiliar).map((grupo) => (
                                <div
                                  key={`${grupo.textoDias}-${grupo.horarioInicio}-${grupo.horarioFin}`}
                                  className="text-xs"
                                >
                                  <span
                                    className="font-semibold"
                                    style={{ color: '#374151' }}
                                  >
                                    {grupo.textoDias}:
                                  </span>{' '}
                                  <span style={{ color: '#536076' }}>
                                    {grupo.horarioInicio} - {grupo.horarioFin}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* ESTADO */}
                          <td className="px-5 py-4">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: auxiliar.activo
                                  ? '#f0fdf4'
                                  : '#fef2f2',
                                color: auxiliar.activo
                                  ? '#166534'
                                  : '#b91c1c',
                              }}
                            >
                              <span
                                className="rounded-full"
                                style={{
                                  width: 6,
                                  height: 6,
                                  backgroundColor:
                                    auxiliar.activo
                                      ? '#16a34a'
                                      : '#dc2626',
                                }}
                              />

                              {auxiliar.activo
                                ? 'Activo'
                                : 'Inactivo'}
                            </span>
                          </td>

                          {/* ACCIONES */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  abrirEdicion(auxiliar)
                                }
                                disabled={
                                  cambiandoEstadoId === auxiliar.id
                                }
                                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                style={{
                                  backgroundColor: B_LIGHT,
                                  color: B_DARK,
                                  border:
                                    '1.5px solid #d1ddf5',
                                  opacity:
                                    cambiandoEstadoId ===
                                    auxiliar.id
                                      ? 0.6
                                      : 1,
                                }}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  cambiarEstado(auxiliar)
                                }
                                disabled={
                                  cambiandoEstadoId === auxiliar.id
                                }
                                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                style={{
                                  backgroundColor:
                                    auxiliar.activo
                                      ? '#fef2f2'
                                      : '#f0fdf4',
                                  color: auxiliar.activo
                                    ? '#b91c1c'
                                    : '#166534',
                                  border: auxiliar.activo
                                    ? '1.5px solid #fecaca'
                                    : '1.5px solid #bbf7d0',
                                  opacity:
                                    cambiandoEstadoId ===
                                    auxiliar.id
                                      ? 0.6
                                      : 1,
                                }}
                              >
                                {cambiandoEstadoId ===
                                auxiliar.id
                                  ? 'Procesando...'
                                  : auxiliar.activo
                                    ? 'Desactivar'
                                    : 'Activar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}

                    {auxiliaresFiltrados.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center px-5 py-14 text-sm"
                          style={{ color: '#8fa0b8' }}
                        >
                          No se encontraron auxiliares.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>

      {/* MODAL */}
      {mostrarFormulario && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.48)',
            zIndex: 50,
          }}
        >
          <div
            className="bg-white rounded-xl w-full overflow-y-auto"
            style={{
              maxWidth: 620,
              maxHeight: '90vh',
              boxShadow:
                '0 20px 50px rgba(15,23,42,0.18)',
            }}
          >
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: '#e2e8f0' }}
            >
              <div>
                <h2
                  className="font-semibold"
                  style={{ color: '#111827' }}
                >
                  {editandoId !== null
                    ? 'Editar auxiliar'
                    : 'Registrar nuevo auxiliar'}
                </h2>

                <p
                  className="text-xs mt-1"
                  style={{ color: '#8fa0b8' }}
                >
                  Completa los datos de acceso y horario.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormulario}
                disabled={guardando}
                className="text-xl"
                style={{ color: '#8fa0b8' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarAuxiliar}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Campo label="Nombre completo *">
                    <input
                      type="text"
                      value={formulario.nombreCompleto}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          nombreCompleto: e.target.value,
                        })
                      }
                      placeholder="Nombre completo del auxiliar"
                      style={inputBase}
                      disabled={guardando}
                    />
                  </Campo>
                </div>

                <Campo label="Código SISS *">
                  <input
                    type="text"
                    value={formulario.codigoSiss}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        codigoSiss: e.target.value,
                      })
                    }
                    placeholder="Ej. 202001823"
                    style={inputBase}
                    disabled={guardando}
                  />

                  <p
                    className="text-xs mt-1"
                    style={{ color: '#8fa0b8' }}
                  >
                    Será el usuario de acceso.
                  </p>
                </Campo>

                <Campo label="Carnet *">
                  <input
                    type="text"
                    value={formulario.carnet}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        carnet: e.target.value,
                      })
                    }
                    placeholder="Ej. 8018935"
                    style={inputBase}
                    disabled={guardando}
                  />

                  <p
                    className="text-xs mt-1"
                    style={{ color: '#8fa0b8' }}
                  >
                    Será la contraseña de acceso.
                  </p>
                </Campo>

                <div className="md:col-span-2">
                  <Campo label="Cargo *">
                    <select
                      value={formulario.cargo}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          cargo: e.target.value,
                        })
                      }
                      style={inputBase}
                      disabled={guardando}
                    >
                      <option value="">Selecciona un cargo</option>

                      {CARGOS_AUXILIAR.map((cargo) => (
                        <option key={cargo} value={cargo}>
                          {cargo}
                        </option>
                      ))}
                    </select>
                  </Campo>
                </div>

                  <div className="md:col-span-2">
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className="mb-4">
                    <div
                      className="text-sm font-semibold"
                      style={{ color: '#111827' }}
                    >
                      Turnos del auxiliar *
                    </div>

                    <p
                      className="text-xs mt-1"
                      style={{ color: '#8fa0b8' }}
                    >
                      Selecciona uno o varios días que compartan el mismo
                      horario. Puedes agregar otro horario después.
                    </p>
                  </div>

                  {/* DÍAS */}
                  <div className="mb-4">
                    <label
                      className="text-xs font-medium block mb-2"
                      style={{ color: '#536076' }}
                    >
                      Días de trabajo
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {DIAS_SEMANA.map((dia) => {
                        const seleccionado = diasSeleccionados.includes(
                          dia.valor
                        );

                        return (
                          <button
                            key={dia.valor}
                            type="button"
                            onClick={() => alternarDia(dia.valor)}
                            disabled={guardando}
                            className="px-3 py-2 rounded-lg text-xs font-medium"
                            style={{
                              backgroundColor: seleccionado
                                ? B_DARK
                                : 'white',
                              color: seleccionado ? 'white' : '#536076',
                              border: seleccionado
                                ? `1.5px solid ${B_DARK}`
                                : '1.5px solid #cdd5e0',
                            }}
                          >
                            {dia.etiqueta}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* HORARIO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Campo label="Hora de inicio">
                      <input
                        type="time"
                        value={nuevoHorarioInicio}
                        onChange={(e) =>
                          setNuevoHorarioInicio(e.target.value)
                        }
                        style={inputBase}
                        disabled={guardando}
                      />
                    </Campo>

                    <Campo label="Hora de finalización">
                      <input
                        type="time"
                        value={nuevoHorarioFin}
                        onChange={(e) =>
                          setNuevoHorarioFin(e.target.value)
                        }
                        style={inputBase}
                        disabled={guardando}
                      />
                    </Campo>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {diaEditandoTurno ? (
                      <>
                        <button
                          type="button"
                          onClick={guardarEdicionTurno}
                          disabled={guardando}
                          className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                          style={{
                            backgroundColor: B_MID,
                            border: `1.5px solid ${B_MID}`,
                          }}
                        >
                          Guardar cambios
                        </button>

                        <button
                          type="button"
                          onClick={cancelarEdicionTurno}
                          disabled={guardando}
                          className="px-4 py-2 rounded-lg text-xs font-semibold"
                          style={{
                            backgroundColor: 'white',
                            color: '#536076',
                            border: '1.5px solid #d1d5db',
                          }}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={agregarTurnos}
                        disabled={guardando}
                        className="px-4 py-2 rounded-lg text-xs font-semibold"
                        style={{
                          backgroundColor: B_LIGHT,
                          color: B_DARK,
                          border: '1.5px solid #d1ddf5',
                        }}
                      >
                        + Agregar turno
                      </button>
                    )}
                  </div>

                  {/* TURNOS CONFIGURADOS */}
                  {formulario.turnos.length > 0 && (
                    <div
                      className="mt-4 pt-4"
                      style={{ borderTop: '1px solid #e2e8f0' }}
                    >
                      <div
                        className="text-xs font-semibold mb-2"
                        style={{ color: '#536076' }}
                      >
                        Turnos configurados
                      </div>

                      <div className="flex flex-col gap-2">
                        {formulario.turnos.map((turno) => {
                          const dia = DIAS_SEMANA.find(
                            (item) => item.valor === turno.dia
                          );

                          return (
                            <div
                              key={turno.dia}
                              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
                              style={{
                                backgroundColor: 'white',
                                border: '1px solid #e2e8f0',
                              }}
                            >
                              <div>
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: '#111827' }}
                                >
                                  {dia?.etiqueta ?? turno.dia}
                                </span>

                                <span
                                  className="text-xs ml-3"
                                  style={{ color: '#536076' }}
                                >
                                  {turno.horarioInicio} - {turno.horarioFin}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => editarTurno(turno)}
                                disabled={guardando}
                                className="text-xs font-medium"
                                style={{ color: B_MID }}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => eliminarTurno(turno.dia)}
                                disabled={guardando}
                                className="text-xs font-medium"
                                style={{ color: '#b91c1c' }}
                              >
                                Quitar
                              </button>
                            </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

                 {mensaje && (
                  <div
                    className="md:col-span-2 rounded-lg px-4 py-3 text-xs"
                    style={{
                      backgroundColor: '#fef2f2',
                      color: '#b91c1c',
                    }}
                  >
                    {mensaje}
                  </div>
                )}

                <div
                  className="md:col-span-2 rounded-lg px-4 py-3"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: '#536076' }}
                  >
                    Credenciales del auxiliar
                  </div>

                  <p
                    className="text-xs"
                    style={{ color: '#8fa0b8' }}
                  >
                    Usuario: Código SISS · Contraseña: Carnet
                  </p>

                  {editandoId !== null && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: '#b45309' }}
                    >
                      Si modificas el carnet, también cambiará la
                      contraseña de acceso del auxiliar.
                    </p>
                  )}
                </div>
              </div>

              <div
                className="px-6 py-4 border-t flex justify-end gap-3"
                style={{
                  borderColor: '#e2e8f0',
                  backgroundColor: '#fafbfd',
                }}
              >
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  disabled={guardando}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    color: '#536076',
                    border: '1.5px solid #cdd5e0',
                    backgroundColor: 'white',
                    opacity: guardando ? 0.6 : 1,
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`,
                    opacity: guardando ? 0.7 : 1,
                  }}
                >
                  {guardando
                    ? 'Guardando...'
                    : editandoId !== null
                      ? 'Guardar cambios'
                      : 'Registrar auxiliar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Resumen({
  titulo,
  valor,
}: {
  titulo: string;
  valor: number;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div
        className="text-xs font-medium"
        style={{ color: '#8fa0b8' }}
      >
        {titulo}
      </div>

      <div
        className="text-2xl font-bold mt-1"
        style={{
          color: '#172033',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {valor}
      </div>
    </div>
  );
}

function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="text-xs font-medium block mb-1.5"
        style={{ color: '#5a6a82' }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}