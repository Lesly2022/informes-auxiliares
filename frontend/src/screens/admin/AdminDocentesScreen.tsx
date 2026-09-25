import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import type { AdminScreen } from '../../types';
import {
  obtenerAdminDocentes,
  crearAdminDocente,
  actualizarAdminDocente,
  cambiarEstadoAdminDocente,
  type AdminDocente,
} from '../../services/admin.service';

interface Props {
  onNavigate: (screen: AdminScreen) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

export default function AdminDocentesScreen({
  onNavigate,
  onLogout,
}: Props) {
  const [docentes, setDocentes] = useState<AdminDocente[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nombreCompleto, setNombreCompleto] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstadoId, setCambiandoEstadoId] =
    useState<number | null>(null);

  // ==========================================
  // CARGAR DOCENTES
  // ==========================================

  const cargarDocentes = async () => {
    try {
      setCargando(true);
      setMensaje('');

      const data = await obtenerAdminDocentes();
      setDocentes(data);
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los docentes'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDocentes();
  }, []);

  // ==========================================
  // FILTRAR
  // ==========================================

  const docentesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return docentes;
    }

    return docentes.filter((docente) =>
      docente.nombreCompleto.toLowerCase().includes(texto)
    );
  }, [docentes, busqueda]);

  const activos = docentes.filter(
    (docente) => docente.activo
  ).length;

  const inactivos = docentes.length - activos;

  // ==========================================
  // MODAL
  // ==========================================

  const abrirNuevo = () => {
    setNombreCompleto('');
    setEditandoId(null);
    setMensaje('');
    setMensajeExito('');
    setMostrarFormulario(true);
  };

  const abrirEdicion = (docente: AdminDocente) => {
    setNombreCompleto(docente.nombreCompleto);
    setEditandoId(docente.id);
    setMensaje('');
    setMensajeExito('');
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    if (guardando) {
      return;
    }

    setNombreCompleto('');
    setEditandoId(null);
    setMensaje('');
    setMostrarFormulario(false);
  };

  // ==========================================
  // CREAR / EDITAR
  // ==========================================

  const guardarDocente = async (e: React.FormEvent) => {
    e.preventDefault();

    const nombre = nombreCompleto.trim();

    setMensaje('');
    setMensajeExito('');

    if (!nombre) {
      setMensaje('Ingresa el nombre completo del docente.');
      return;
    }

    const repetido = docentes.some(
      (docente) =>
        docente.nombreCompleto.trim().toLowerCase() ===
          nombre.toLowerCase() &&
        docente.id !== editandoId
    );

    if (repetido) {
      setMensaje('Este docente ya se encuentra registrado.');
      return;
    }

    try {
      setGuardando(true);

      if (editandoId !== null) {
        const actualizado = await actualizarAdminDocente(
          editandoId,
          nombre
        );

        setDocentes((actuales) =>
          actuales
            .map((docente) =>
              docente.id === actualizado.id
                ? actualizado
                : docente
            )
            .sort((a, b) =>
              a.nombreCompleto.localeCompare(b.nombreCompleto)
            )
        );

        setMensajeExito('Docente actualizado correctamente.');
      } else {
        const nuevo = await crearAdminDocente(nombre);

        setDocentes((actuales) =>
          [...actuales, nuevo].sort((a, b) =>
            a.nombreCompleto.localeCompare(b.nombreCompleto)
          )
        );

        setMensajeExito('Docente registrado correctamente.');
      }

      setMostrarFormulario(false);
      setEditandoId(null);
      setNombreCompleto('');
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el docente'
      );
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // ACTIVAR / DESACTIVAR
  // ==========================================

  const cambiarEstado = async (docente: AdminDocente) => {
    const nuevoEstado = !docente.activo;

    try {
      setCambiandoEstadoId(docente.id);
      setMensaje('');
      setMensajeExito('');

      const actualizado = await cambiarEstadoAdminDocente(
        docente.id,
        nuevoEstado
      );

      setDocentes((actuales) =>
        actuales.map((item) =>
          item.id === actualizado.id ? actualizado : item
        )
      );

      setMensajeExito(
        nuevoEstado
          ? 'Docente activado correctamente.'
          : 'Docente desactivado correctamente.'
      );
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado del docente'
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
        active="admin-docentes"
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
              Gestión de docentes
            </h1>

            <p
              className="text-xs mt-0.5"
              style={{ color: '#5a6a82' }}
            >
              Administra los docentes disponibles para los informes.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirNuevo}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`,
              boxShadow: '0 2px 8px rgba(37,84,168,0.28)',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            Nuevo docente
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
              titulo="Total de docentes"
              valor={docentes.length}
            />

            <Resumen titulo="Activos" valor={activos} />

            <Resumen titulo="Inactivos" valor={inactivos} />
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
              Buscar docente
            </label>

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
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
                Docentes registrados
              </h2>

              <p
                className="text-xs mt-0.5"
                style={{ color: '#8fa0b8' }}
              >
                {cargando
                  ? 'Cargando docentes...'
                  : `${docentesFiltrados.length} ${
                      docentesFiltrados.length === 1
                        ? 'docente encontrado'
                        : 'docentes encontrados'
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
                  Cargando docentes...
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
                        'Docente',
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
                    {docentesFiltrados.map(
                      (docente, index) => (
                        <tr
                          key={docente.id}
                          style={{
                            borderBottom:
                              index <
                              docentesFiltrados.length - 1
                                ? '1px solid #f0f4fb'
                                : 'none',
                          }}
                        >
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
                                {docente.nombreCompleto
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
                                  {docente.nombreCompleto}
                                </div>

                                <div
                                  className="text-xs mt-0.5"
                                  style={{ color: '#8fa0b8' }}
                                >
                                  Docente
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: docente.activo
                                  ? '#f0fdf4'
                                  : '#fef2f2',
                                color: docente.activo
                                  ? '#166534'
                                  : '#b91c1c',
                              }}
                            >
                              <span
                                className="rounded-full"
                                style={{
                                  width: 6,
                                  height: 6,
                                  backgroundColor: docente.activo
                                    ? '#16a34a'
                                    : '#dc2626',
                                }}
                              />

                              {docente.activo
                                ? 'Activo'
                                : 'Inactivo'}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  abrirEdicion(docente)
                                }
                                disabled={
                                  cambiandoEstadoId === docente.id
                                }
                                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                style={{
                                  backgroundColor: B_LIGHT,
                                  color: B_DARK,
                                  border:
                                    '1.5px solid #d1ddf5',
                                  opacity:
                                    cambiandoEstadoId ===
                                    docente.id
                                      ? 0.6
                                      : 1,
                                }}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  cambiarEstado(docente)
                                }
                                disabled={
                                  cambiandoEstadoId === docente.id
                                }
                                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                style={{
                                  backgroundColor:
                                    docente.activo
                                      ? '#fef2f2'
                                      : '#f0fdf4',
                                  color: docente.activo
                                    ? '#b91c1c'
                                    : '#166534',
                                  border: docente.activo
                                    ? '1.5px solid #fecaca'
                                    : '1.5px solid #bbf7d0',
                                  opacity:
                                    cambiandoEstadoId ===
                                    docente.id
                                      ? 0.6
                                      : 1,
                                }}
                              >
                                {cambiandoEstadoId === docente.id
                                  ? 'Procesando...'
                                  : docente.activo
                                    ? 'Desactivar'
                                    : 'Activar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}

                    {docentesFiltrados.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center px-5 py-14 text-sm"
                          style={{ color: '#8fa0b8' }}
                        >
                          No se encontraron docentes.
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
                    ? 'Editar docente'
                    : 'Registrar nuevo docente'}
                </h2>

                <p
                  className="text-xs mt-1"
                  style={{ color: '#8fa0b8' }}
                >
                  Ingresa los datos del docente.
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

            <form onSubmit={guardarDocente}>
              <div className="p-6">
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: '#5a6a82' }}
                >
                  Nombre completo *
                </label>

                <input
                  type="text"
                  value={nombreCompleto}
                  onChange={(e) =>
                    setNombreCompleto(e.target.value)
                  }
                  placeholder="Nombre completo del docente"
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
                    Los docentes activos estarán disponibles
                    posteriormente en el selector utilizado por los
                    auxiliares al registrar actividades académicas.
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
                      : 'Registrar docente'}
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