import { useMemo, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import type { AdminScreen } from '../../types';

interface Props {
  onNavigate: (screen: AdminScreen) => void;
  onLogout: () => void;
}

interface Sala {
  id: number;
  nombre: string;
  activo: boolean;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

const salasIniciales: Sala[] = [
  {
    id: 1,
    nombre: 'Laboratorio 1',
    activo: true,
  },
  {
    id: 2,
    nombre: 'Laboratorio 2',
    activo: true,
  },
  {
    id: 3,
    nombre: 'Laboratorio 3',
    activo: true,
  },
  {
    id: 4,
    nombre: 'Sala de Internet',
    activo: false,
  },
];

export default function AdminSalasScreen({
  onNavigate,
  onLogout,
}: Props) {
  const [salas, setSalas] = useState<Sala[]>(salasIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const salasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return salas;
    }

    return salas.filter((sala) =>
      sala.nombre.toLowerCase().includes(texto),
    );
  }, [salas, busqueda]);

  const activas = salas.filter((sala) => sala.activo).length;
  const inactivas = salas.length - activas;

  const abrirNueva = () => {
    setNombre('');
    setEditandoId(null);
    setMensaje('');
    setMostrarFormulario(true);
  };

  const abrirEdicion = (sala: Sala) => {
    setNombre(sala.nombre);
    setEditandoId(sala.id);
    setMensaje('');
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setNombre('');
    setEditandoId(null);
    setMensaje('');
    setMostrarFormulario(false);
  };

  const guardarSala = (e: React.FormEvent) => {
    e.preventDefault();

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      setMensaje('Ingresa el nombre de la sala.');
      return;
    }

    const repetida = salas.some(
      (sala) =>
        sala.nombre.toLowerCase() === nombreLimpio.toLowerCase() &&
        sala.id !== editandoId,
    );

    if (repetida) {
      setMensaje('Esta sala ya se encuentra registrada.');
      return;
    }

    if (editandoId !== null) {
      setSalas((actuales) =>
        actuales.map((sala) =>
          sala.id === editandoId
            ? {
                ...sala,
                nombre: nombreLimpio,
              }
            : sala,
        ),
      );
    } else {
      const nuevaSala: Sala = {
        id:
          salas.length > 0
            ? Math.max(...salas.map((sala) => sala.id)) + 1
            : 1,
        nombre: nombreLimpio,
        activo: true,
      };

      setSalas((actuales) => [nuevaSala, ...actuales]);
    }

    cerrarFormulario();
  };

  const cambiarEstado = (id: number) => {
    setSalas((actuales) =>
      actuales.map((sala) =>
        sala.id === id
          ? {
              ...sala,
              activo: !sala.activo,
            }
          : sala,
      ),
    );
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
        active="admin-salas"
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
              Gestión de salas
            </h1>

            <p
              className="text-xs mt-0.5"
              style={{ color: '#5a6a82' }}
            >
              Administra las salas y laboratorios disponibles.
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
            <span style={{ fontSize: 18, lineHeight: 1 }}>
              +
            </span>
            Nueva sala
          </button>
        </header>

        <div className="flex-1 px-8 py-6">
          {/* RESUMEN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <Resumen
              titulo="Total de salas"
              valor={salas.length}
            />

            <Resumen
              titulo="Activas"
              valor={activas}
            />

            <Resumen
              titulo="Inactivas"
              valor={inactivas}
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
              Buscar sala
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
                Salas registradas
              </h2>

              <p
                className="text-xs mt-0.5"
                style={{ color: '#8fa0b8' }}
              >
                {salasFiltradas.length}{' '}
                {salasFiltradas.length === 1
                  ? 'sala encontrada'
                  : 'salas encontradas'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {['Sala', 'Estado', 'Acciones'].map(
                      (columna) => (
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
                      ),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {salasFiltradas.map((sala, index) => (
                    <tr
                      key={sala.id}
                      style={{
                        borderBottom:
                          index < salasFiltradas.length - 1
                            ? '1px solid #f0f4fb'
                            : 'none',
                      }}
                    >
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
                              <path d="M3 21h18" />
                              <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                              <path d="M9 9h6" />
                              <path d="M9 13h6" />
                              <path d="M9 17h2" />
                            </svg>
                          </div>

                          <div>
                            <div
                              className="text-sm font-medium"
                              style={{ color: '#111827' }}
                            >
                              {sala.nombre}
                            </div>

                            <div
                              className="text-xs mt-0.5"
                              style={{ color: '#8fa0b8' }}
                            >
                              Sala / Laboratorio
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: sala.activo
                              ? '#f0fdf4'
                              : '#fef2f2',
                            color: sala.activo
                              ? '#166534'
                              : '#b91c1c',
                          }}
                        >
                          <span
                            className="rounded-full"
                            style={{
                              width: 6,
                              height: 6,
                              backgroundColor: sala.activo
                                ? '#16a34a'
                                : '#dc2626',
                            }}
                          />

                          {sala.activo
                            ? 'Activa'
                            : 'Inactiva'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => abrirEdicion(sala)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{
                              backgroundColor: B_LIGHT,
                              color: B_DARK,
                              border: '1.5px solid #d1ddf5',
                            }}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              cambiarEstado(sala.id)
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{
                              backgroundColor: sala.activo
                                ? '#fef2f2'
                                : '#f0fdf4',
                              color: sala.activo
                                ? '#b91c1c'
                                : '#166534',
                              border: sala.activo
                                ? '1.5px solid #fecaca'
                                : '1.5px solid #bbf7d0',
                            }}
                          >
                            {sala.activo
                              ? 'Desactivar'
                              : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {salasFiltradas.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center px-5 py-14 text-sm"
                        style={{ color: '#8fa0b8' }}
                      >
                        No se encontraron salas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
                    ? 'Editar sala'
                    : 'Registrar nueva sala'}
                </h2>

                <p
                  className="text-xs mt-1"
                  style={{ color: '#8fa0b8' }}
                >
                  Ingresa el nombre de la sala o laboratorio.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormulario}
                className="text-xl"
                style={{ color: '#8fa0b8' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarSala}>
              <div className="p-6">
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: '#5a6a82' }}
                >
                  Nombre de la sala *
                </label>

                <input
                  type="text"
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  placeholder="Ej. Laboratorio 4"
                  style={inputBase}
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
                    Las salas activas estarán disponibles
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
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    color: '#536076',
                    border: '1.5px solid #cdd5e0',
                    backgroundColor: 'white',
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`,
                  }}
                >
                  {editandoId !== null
                    ? 'Guardar cambios'
                    : 'Registrar sala'}
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