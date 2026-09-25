import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import type { AdminScreen } from '../../types';
import {
  obtenerAdminMaterias,
  crearAdminMateria,
  actualizarAdminMateria,
  cambiarEstadoAdminMateria,
  type AdminMateria,
} from '../../services/admin.service';

interface Props {
  onNavigate: (screen: AdminScreen) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

export default function AdminMateriasScreen({
  onNavigate,
  onLogout,
}: Props) {
  const [materias, setMaterias] = useState<AdminMateria[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstadoId, setCambiandoEstadoId] =
    useState<number | null>(null);

  // ==========================================
  // CARGAR MATERIAS
  // ==========================================

  const cargarMaterias = async () => {
    try {
      setCargando(true);
      setMensaje('');

      const data = await obtenerAdminMaterias();
      setMaterias(data);
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las materias'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  // ==========================================
  // FILTRAR
  // ==========================================

  const materiasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return materias;
    }

    return materias.filter((materia) => {
      const codigoMateria = materia.codigo?.toLowerCase() || '';
      const nombreMateria = materia.nombre.toLowerCase();

      return (
        codigoMateria.includes(texto) ||
        nombreMateria.includes(texto)
      );
    });
  }, [materias, busqueda]);

  const activas = materias.filter((materia) => materia.activo).length;
  const inactivas = materias.length - activas;

  // ==========================================
  // MODAL
  // ==========================================

  const abrirNueva = () => {
    setCodigo('');
    setNombre('');
    setEditandoId(null);
    setMensaje('');
    setMensajeExito('');
    setMostrarFormulario(true);
  };

  const abrirEdicion = (materia: AdminMateria) => {
    setCodigo(materia.codigo || '');
    setNombre(materia.nombre);
    setEditandoId(materia.id);
    setMensaje('');
    setMensajeExito('');
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    if (guardando) {
      return;
    }

    setCodigo('');
    setNombre('');
    setEditandoId(null);
    setMensaje('');
    setMostrarFormulario(false);
  };

  // ==========================================
  // CREAR / EDITAR
  // ==========================================

  const guardarMateria = async (e: React.FormEvent) => {
    e.preventDefault();

    const codigoLimpio = codigo.trim();
    const nombreLimpio = nombre.trim();

    setMensaje('');
    setMensajeExito('');

    if (!nombreLimpio) {
      setMensaje('Ingresa el nombre de la materia.');
      return;
    }

    const nombreRepetido = materias.some(
      (materia) =>
        materia.nombre.trim().toLowerCase() ===
          nombreLimpio.toLowerCase() &&
        materia.id !== editandoId
    );

    if (nombreRepetido) {
      setMensaje('Esta materia ya se encuentra registrada.');
      return;
    }

    if (codigoLimpio) {
      const codigoRepetido = materias.some(
        (materia) =>
          materia.codigo?.trim().toLowerCase() ===
            codigoLimpio.toLowerCase() &&
          materia.id !== editandoId
      );

      if (codigoRepetido) {
        setMensaje(
          'El código ingresado ya pertenece a otra materia.'
        );
        return;
      }
    }

    try {
      setGuardando(true);

      if (editandoId !== null) {
        const actualizada = await actualizarAdminMateria(
          editandoId,
          codigoLimpio,
          nombreLimpio
        );

        setMaterias((actuales) =>
          actuales
            .map((materia) =>
              materia.id === actualizada.id
                ? actualizada
                : materia
            )
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
        );

        setMensajeExito('Materia actualizada correctamente.');
      } else {
        const nueva = await crearAdminMateria(
          codigoLimpio,
          nombreLimpio
        );

        setMaterias((actuales) =>
          [...actuales, nueva].sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          )
        );

        setMensajeExito('Materia registrada correctamente.');
      }

      setMostrarFormulario(false);
      setEditandoId(null);
      setCodigo('');
      setNombre('');
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la materia'
      );
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // ACTIVAR / DESACTIVAR
  // ==========================================

  const cambiarEstado = async (materia: AdminMateria) => {
    const nuevoEstado = !materia.activo;

    try {
      setCambiandoEstadoId(materia.id);
      setMensaje('');
      setMensajeExito('');

      const actualizada = await cambiarEstadoAdminMateria(
        materia.id,
        nuevoEstado
      );

      setMaterias((actuales) =>
        actuales.map((item) =>
          item.id === actualizada.id ? actualizada : item
        )
      );

      setMensajeExito(
        nuevoEstado
          ? 'Materia activada correctamente.'
          : 'Materia desactivada correctamente.'
      );
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado de la materia'
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
        active="admin-materias"
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
              Gestión de materias
            </h1>

            <p
              className="text-xs mt-0.5"
              style={{ color: '#5a6a82' }}
            >
              Administra las materias disponibles para los informes.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirNueva}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`,
              boxShadow: '0 2px 8px rgba(37,84,168,0.28)',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            Nueva materia
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
              titulo="Total de materias"
              valor={materias.length}
            />
            <Resumen titulo="Activas" valor={activas} />
            <Resumen titulo="Inactivas" valor={inactivas} />
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
              Buscar materia
            </label>

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por código o nombre..."
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
                Materias registradas
              </h2>

              <p
                className="text-xs mt-0.5"
                style={{ color: '#8fa0b8' }}
              >
                {cargando
                  ? 'Cargando materias...'
                  : `${materiasFiltradas.length} ${
                      materiasFiltradas.length === 1
                        ? 'materia encontrada'
                        : 'materias encontradas'
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
                  Cargando materias...
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
                        'Código',
                        'Materia',
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
                    {materiasFiltradas.map((materia, index) => (
                      <tr
                        key={materia.id}
                        style={{
                          borderBottom:
                            index < materiasFiltradas.length - 1
                              ? '1px solid #f0f4fb'
                              : 'none',
                        }}
                      >
                        <td className="px-5 py-4">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-md"
                            style={{
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                            }}
                          >
                            {materia.codigo || 'Sin código'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                width: 36,
                                height: 36,
                                backgroundColor: B_LIGHT,
                                color: B_DARK,
                              }}
                            >
                              <svg
                                width="17"
                                height="17"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                              </svg>
                            </div>

                            <div>
                              <div
                                className="text-sm font-medium"
                                style={{ color: '#111827' }}
                              >
                                {materia.nombre}
                              </div>

                              <div
                                className="text-xs mt-0.5"
                                style={{ color: '#8fa0b8' }}
                              >
                                Materia académica
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: materia.activo
                                ? '#f0fdf4'
                                : '#fef2f2',
                              color: materia.activo
                                ? '#166534'
                                : '#b91c1c',
                            }}
                          >
                            <span
                              className="rounded-full"
                              style={{
                                width: 6,
                                height: 6,
                                backgroundColor: materia.activo
                                  ? '#16a34a'
                                  : '#dc2626',
                              }}
                            />

                            {materia.activo
                              ? 'Activa'
                              : 'Inactiva'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                abrirEdicion(materia)
                              }
                              disabled={
                                cambiandoEstadoId === materia.id
                              }
                              className="px-3 py-1.5 rounded-lg text-xs font-medium"
                              style={{
                                backgroundColor: B_LIGHT,
                                color: B_DARK,
                                border: '1.5px solid #d1ddf5',
                                opacity:
                                  cambiandoEstadoId === materia.id
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                cambiarEstado(materia)
                              }
                              disabled={
                                cambiandoEstadoId === materia.id
                              }
                              className="px-3 py-1.5 rounded-lg text-xs font-medium"
                              style={{
                                backgroundColor: materia.activo
                                  ? '#fef2f2'
                                  : '#f0fdf4',
                                color: materia.activo
                                  ? '#b91c1c'
                                  : '#166534',
                                border: materia.activo
                                  ? '1.5px solid #fecaca'
                                  : '1.5px solid #bbf7d0',
                                opacity:
                                  cambiandoEstadoId === materia.id
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {cambiandoEstadoId === materia.id
                                ? 'Procesando...'
                                : materia.activo
                                  ? 'Desactivar'
                                  : 'Activar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {materiasFiltradas.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center px-5 py-14 text-sm"
                          style={{ color: '#8fa0b8' }}
                        >
                          No se encontraron materias.
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
            className="bg-white rounded-xl w-full overflow-hidden"
            style={{
              maxWidth: 520,
              boxShadow: '0 20px 50px rgba(15,23,42,0.18)',
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
                    ? 'Editar materia'
                    : 'Registrar nueva materia'}
                </h2>

                <p
                  className="text-xs mt-1"
                  style={{ color: '#8fa0b8' }}
                >
                  Ingresa los datos de la materia.
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

            <form onSubmit={guardarMateria}>
              <div className="p-6">
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: '#5a6a82' }}
                >
                  Código de la materia
                </label>

                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ej. SIS-101"
                  style={inputBase}
                  disabled={guardando}
                />

                <label
                  className="text-xs font-medium block mb-1.5 mt-4"
                  style={{ color: '#5a6a82' }}
                >
                  Nombre de la materia *
                </label>

                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Base de Datos I"
                  style={inputBase}
                  disabled={guardando}
                />

                {mensaje && (
                  <div
                    className="rounded-lg px-4 py-3 text-xs mt-4"
                    style={{
                      backgroundColor: '#fef2f2',
                      color: '#b91c1c',
                    }}
                  >
                    {mensaje}
                  </div>
                )}

                <div
                  className="rounded-lg px-4 py-3 mt-4"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <p
                    className="text-xs"
                    style={{ color: '#6b778c' }}
                  >
                    Las materias activas estarán disponibles
                    posteriormente en el formulario de informes
                    utilizado por los auxiliares.
                  </p>
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
                      : 'Registrar materia'}
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