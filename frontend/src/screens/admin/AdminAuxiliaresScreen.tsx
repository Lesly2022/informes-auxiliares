import { useMemo, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import type { AdminScreen } from '../../types';

interface Props {
  onNavigate: (screen: AdminScreen) => void;
  onLogout: () => void;
}

interface Auxiliar {
  id: number;
  nombreCompleto: string;
  codigoSiss: string;
  carnet: string;
  cargo: string;
  horarioInicio: string;
  horarioFin: string;
  activo: boolean;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

const auxiliaresIniciales: Auxiliar[] = [
  {
    id: 1,
    nombreCompleto: 'José Alejandro Montaño Laura',
    codigoSiss: '202001823',
    carnet: '8018935',
    cargo: 'Auxiliar de Laboratorio de Cómputo',
    horarioInicio: '09:00',
    horarioFin: '13:00',
    activo: true,
  },
  {
    id: 2,
    nombreCompleto: 'María Fernanda López',
    codigoSiss: '202103245',
    carnet: '9123456',
    cargo: 'Auxiliar de Laboratorio de Cómputo',
    horarioInicio: '13:00',
    horarioFin: '17:00',
    activo: true,
  },
  {
    id: 3,
    nombreCompleto: 'Carlos Mendoza Rojas',
    codigoSiss: '202004587',
    carnet: '7458963',
    cargo: 'Auxiliar de Laboratorio de Cómputo',
    horarioInicio: '08:00',
    horarioFin: '12:00',
    activo: false,
  },
];

const formularioVacio = {
  nombreCompleto: '',
  codigoSiss: '',
  carnet: '',
  cargo: 'Auxiliar de Laboratorio de Cómputo',
  horarioInicio: '',
  horarioFin: '',
};

export default function AdminAuxiliaresScreen({
  onNavigate,
  onLogout,
}: Props) {
  const [auxiliares, setAuxiliares] =
    useState<Auxiliar[]>(auxiliaresIniciales);

  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');

  const [formulario, setFormulario] =
    useState(formularioVacio);

  const auxiliaresFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return auxiliares;
    }

    return auxiliares.filter(
      (auxiliar) =>
        auxiliar.nombreCompleto.toLowerCase().includes(texto) ||
        auxiliar.codigoSiss.toLowerCase().includes(texto) ||
        auxiliar.carnet.toLowerCase().includes(texto),
    );
  }, [auxiliares, busqueda]);

  const abrirNuevoAuxiliar = () => {
    setFormulario(formularioVacio);
    setEditandoId(null);
    setMensaje('');
    setMostrarFormulario(true);
  };

  const abrirEdicion = (auxiliar: Auxiliar) => {
    setFormulario({
      nombreCompleto: auxiliar.nombreCompleto,
      codigoSiss: auxiliar.codigoSiss,
      carnet: auxiliar.carnet,
      cargo: auxiliar.cargo,
      horarioInicio: auxiliar.horarioInicio,
      horarioFin: auxiliar.horarioFin,
    });

    setEditandoId(auxiliar.id);
    setMensaje('');
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditandoId(null);
    setFormulario(formularioVacio);
    setMensaje('');
  };

  const guardarAuxiliar = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');

    const nombre = formulario.nombreCompleto.trim();
    const codigoSiss = formulario.codigoSiss.trim();
    const carnet = formulario.carnet.trim();

    if (
      !nombre ||
      !codigoSiss ||
      !carnet ||
      !formulario.horarioInicio ||
      !formulario.horarioFin
    ) {
      setMensaje('Completa todos los campos obligatorios.');
      return;
    }

    const codigoRepetido = auxiliares.some(
      (auxiliar) =>
        auxiliar.codigoSiss === codigoSiss &&
        auxiliar.id !== editandoId,
    );

    if (codigoRepetido) {
      setMensaje('Ya existe un auxiliar con ese Código SISS.');
      return;
    }

    if (formulario.horarioInicio >= formulario.horarioFin) {
      setMensaje(
        'La hora de inicio debe ser anterior a la hora de finalización.',
      );
      return;
    }

    if (editandoId !== null) {
      setAuxiliares((actuales) =>
        actuales.map((auxiliar) =>
          auxiliar.id === editandoId
            ? {
                ...auxiliar,
                nombreCompleto: nombre,
                codigoSiss,
                carnet,
                cargo: formulario.cargo.trim(),
                horarioInicio: formulario.horarioInicio,
                horarioFin: formulario.horarioFin,
              }
            : auxiliar,
        ),
      );
    } else {
      const nuevoAuxiliar: Auxiliar = {
        id:
          auxiliares.length > 0
            ? Math.max(...auxiliares.map((auxiliar) => auxiliar.id)) + 1
            : 1,
        nombreCompleto: nombre,
        codigoSiss,
        carnet,
        cargo: formulario.cargo.trim(),
        horarioInicio: formulario.horarioInicio,
        horarioFin: formulario.horarioFin,
        activo: true,
      };

      setAuxiliares((actuales) => [
        nuevoAuxiliar,
        ...actuales,
      ]);
    }

    cerrarFormulario();
  };

  const cambiarEstado = (id: number) => {
    setAuxiliares((actuales) =>
      actuales.map((auxiliar) =>
        auxiliar.id === id
          ? { ...auxiliar, activo: !auxiliar.activo }
          : auxiliar,
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
                {auxiliaresFiltrados.length}{' '}
                {auxiliaresFiltrados.length === 1
                  ? 'auxiliar encontrado'
                  : 'auxiliares encontrados'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {[
                      'Auxiliar',
                      'Código SISS',
                      'Horario',
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
                  {auxiliaresFiltrados.map((auxiliar, index) => (
                    <tr
                      key={auxiliar.id}
                      style={{
                        borderBottom:
                          index < auxiliaresFiltrados.length - 1
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
                            {auxiliar.nombreCompleto
                              .split(' ')
                              .slice(0, 2)
                              .map((nombre) => nombre.charAt(0))
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

                      <td
                        className="px-5 py-4 text-sm"
                        style={{ color: '#536076' }}
                      >
                        {auxiliar.horarioInicio} -{' '}
                        {auxiliar.horarioFin}
                      </td>

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
                              backgroundColor: auxiliar.activo
                                ? '#16a34a'
                                : '#dc2626',
                            }}
                          />

                          {auxiliar.activo
                            ? 'Activo'
                            : 'Inactivo'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => abrirEdicion(auxiliar)}
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
                              cambiarEstado(auxiliar.id)
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{
                              backgroundColor: auxiliar.activo
                                ? '#fef2f2'
                                : '#f0fdf4',
                              color: auxiliar.activo
                                ? '#b91c1c'
                                : '#166534',
                              border: auxiliar.activo
                                ? '1.5px solid #fecaca'
                                : '1.5px solid #bbf7d0',
                            }}
                          >
                            {auxiliar.activo
                              ? 'Desactivar'
                              : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

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
              maxWidth: 620,
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
                  />

                  <p
                    className="text-xs mt-1"
                    style={{ color: '#8fa0b8' }}
                  >
                    Será la contraseña inicial.
                  </p>
                </Campo>

                <div className="md:col-span-2">
                  <Campo label="Cargo">
                    <input
                      type="text"
                      value={formulario.cargo}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          cargo: e.target.value,
                        })
                      }
                      style={inputBase}
                    />
                  </Campo>
                </div>

                <Campo label="Horario de inicio *">
                  <input
                    type="time"
                    value={formulario.horarioInicio}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        horarioInicio: e.target.value,
                      })
                    }
                    style={inputBase}
                  />
                </Campo>

                <Campo label="Horario de finalización *">
                  <input
                    type="time"
                    value={formulario.horarioFin}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        horarioFin: e.target.value,
                      })
                    }
                    style={inputBase}
                  />
                </Campo>

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
                    Usuario: Código SISS · Contraseña inicial: Carnet
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