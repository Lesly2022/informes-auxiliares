import { useMemo, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import type { AdminScreen } from '../../types';

interface Props {
  onNavigate: (screen: AdminScreen, id?: string) => void;
  onLogout: () => void;
}

interface InformeAdmin {
  id: number;
  fecha: string;
  auxiliarId: number;
  auxiliar: string;
  horarioInicio: string;
  horarioFin: string;
  actividades: number;
  estado: 'GUARDADO';
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

/*
 * DATOS TEMPORALES DEL FRONTEND
 * Después serán reemplazados por información proveniente del backend.
 */
const informesIniciales: InformeAdmin[] = [
  {
    id: 1,
    fecha: '2026-09-20',
    auxiliarId: 1,
    auxiliar: 'José Alejandro Montaño Laura',
    horarioInicio: '09:00',
    horarioFin: '13:00',
    actividades: 4,
    estado: 'GUARDADO',
  },
  {
    id: 2,
    fecha: '2026-09-20',
    auxiliarId: 2,
    auxiliar: 'María Fernanda López',
    horarioInicio: '13:00',
    horarioFin: '17:00',
    actividades: 3,
    estado: 'GUARDADO',
  },
  {
    id: 3,
    fecha: '2026-09-19',
    auxiliarId: 3,
    auxiliar: 'Carlos Mendoza Rojas',
    horarioInicio: '08:00',
    horarioFin: '12:00',
    actividades: 5,
    estado: 'GUARDADO',
  },
  {
    id: 4,
    fecha: '2026-09-19',
    auxiliarId: 4,
    auxiliar: 'Andrea Vargas Flores',
    horarioInicio: '14:00',
    horarioFin: '18:00',
    actividades: 2,
    estado: 'GUARDADO',
  },
  {
    id: 5,
    fecha: '2026-09-18',
    auxiliarId: 5,
    auxiliar: 'Luis Fernando Rocha',
    horarioInicio: '09:00',
    horarioFin: '13:00',
    actividades: 4,
    estado: 'GUARDADO',
  },
  {
    id: 6,
    fecha: '2026-08-28',
    auxiliarId: 1,
    auxiliar: 'José Alejandro Montaño Laura',
    horarioInicio: '09:00',
    horarioFin: '13:00',
    actividades: 3,
    estado: 'GUARDADO',
  },
  {
    id: 7,
    fecha: '2026-08-25',
    auxiliarId: 2,
    auxiliar: 'María Fernanda López',
    horarioInicio: '13:00',
    horarioFin: '17:00',
    actividades: 6,
    estado: 'GUARDADO',
  },
  {
    id: 8,
    fecha: '2026-07-15',
    auxiliarId: 3,
    auxiliar: 'Carlos Mendoza Rojas',
    horarioInicio: '08:00',
    horarioFin: '12:00',
    actividades: 4,
    estado: 'GUARDADO',
  },
];

const meses = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

function formatearFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

export default function AdminInformesScreen({
  onNavigate,
  onLogout,
}: Props) {
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [auxiliarId, setAuxiliarId] = useState('');

  const auxiliares = useMemo(() => {
    const mapa = new Map<number, string>();

    informesIniciales.forEach((informe) => {
      mapa.set(informe.auxiliarId, informe.auxiliar);
    });

    return Array.from(mapa.entries())
      .map(([id, nombre]) => ({
        id,
        nombre,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, []);

  const anios = useMemo(() => {
    return Array.from(
      new Set(
        informesIniciales.map((informe) =>
          new Date(`${informe.fecha}T00:00:00`).getFullYear(),
        ),
      ),
    ).sort((a, b) => b - a);
  }, []);

  const informesFiltrados = useMemo(() => {
    return informesIniciales.filter((informe) => {
      const [informeAnio, informeMes, informeDia] = informe.fecha
        .split('-')
        .map(Number);

      const coincideDia =
        !dia || informeDia === Number(dia);

      const coincideMes =
        !mes || informeMes === Number(mes);

      const coincideAnio =
        !anio || informeAnio === Number(anio);

      const coincideAuxiliar =
        !auxiliarId ||
        informe.auxiliarId === Number(auxiliarId);

      return (
        coincideDia &&
        coincideMes &&
        coincideAnio &&
        coincideAuxiliar
      );
    });
  }, [dia, mes, anio, auxiliarId]);

  const hayFiltros = dia || mes || anio || auxiliarId;

  const limpiarFiltros = () => {
    setDia('');
    setMes('');
    setAnio('');
    setAuxiliarId('');
  };

  const inputBase: React.CSSProperties = {
    border: '1.5px solid #cdd5e0',
    backgroundColor: '#f8fafc',
    color: '#111827',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    minWidth: 130,
  };

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <AdminSidebar
        active="admin-informes"
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
              Informes de auxiliares
            </h1>

            <p
              className="text-xs mt-0.5"
              style={{ color: '#5a6a82' }}
            >
              Consulta los informes registrados por todos los auxiliares.
            </p>
          </div>

          <div className="text-right">
            <div
              className="text-sm font-semibold"
              style={{ color: '#26354d' }}
            >
              Administrador
            </div>

            <div
              className="text-xs"
              style={{ color: '#8993a5' }}
            >
              Laboratorio de Cómputo
            </div>
          </div>
        </header>

        <div className="flex-1 px-8 py-6">
          {/* FILTROS */}
          <div
            className="rounded-xl p-5 mb-5"
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div className="mb-4">
              <h2
                className="text-sm font-semibold"
                style={{ color: '#111827' }}
              >
                Filtrar informes
              </h2>

              <p
                className="text-xs mt-1"
                style={{ color: '#8fa0b8' }}
              >
                Puedes combinar los filtros para realizar una búsqueda más
                específica.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-end">
              {/* DÍA */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs font-medium"
                  style={{ color: '#5a6a82' }}
                >
                  Día
                </label>

                <select
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  style={inputBase}
                >
                  <option value="">Todos</option>

                  {Array.from({ length: 31 }, (_, i) => i + 1).map(
                    (numero) => (
                      <option key={numero} value={numero}>
                        {numero}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* MES */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs font-medium"
                  style={{ color: '#5a6a82' }}
                >
                  Mes
                </label>

                <select
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  style={inputBase}
                >
                  <option value="">Todos</option>

                  {meses.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* AÑO */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs font-medium"
                  style={{ color: '#5a6a82' }}
                >
                  Año
                </label>

                <select
                  value={anio}
                  onChange={(e) => setAnio(e.target.value)}
                  style={inputBase}
                >
                  <option value="">Todos</option>

                  {anios.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* AUXILIAR */}
              <div className="flex flex-col gap-1 flex-1 min-w-56">
                <label
                  className="text-xs font-medium"
                  style={{ color: '#5a6a82' }}
                >
                  Auxiliar
                </label>

                <select
                  value={auxiliarId}
                  onChange={(e) => setAuxiliarId(e.target.value)}
                  style={{
                    ...inputBase,
                    width: '100%',
                  }}
                >
                  <option value="">Todos los auxiliares</option>

                  {auxiliares.map((auxiliar) => (
                    <option
                      key={auxiliar.id}
                      value={auxiliar.id}
                    >
                      {auxiliar.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {hayFiltros && (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="px-4 py-2 rounded-lg text-xs font-medium"
                  style={{
                    color: '#5a6a82',
                    backgroundColor: '#f1f4f9',
                    minHeight: 36,
                  }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
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
            {/* CABECERA DE RESULTADOS */}
            <div
              className="px-5 py-4 flex items-center justify-between border-b"
              style={{ borderColor: '#e2e8f0' }}
            >
              <div>
                <h2
                  className="text-sm font-semibold"
                  style={{ color: '#111827' }}
                >
                  Resultados
                </h2>

                <p
                  className="text-xs mt-0.5"
                  style={{ color: '#8fa0b8' }}
                >
                  {informesFiltrados.length}{' '}
                  {informesFiltrados.length === 1
                    ? 'informe encontrado'
                    : 'informes encontrados'}
                </p>
              </div>
            </div>

            {informesFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="rounded-xl flex items-center justify-center mb-4"
                  style={{
                    width: 52,
                    height: 52,
                    backgroundColor: '#f1f4f9',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8fa0b8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>

                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: '#5a6a82' }}
                >
                  No se encontraron informes
                </p>

                <p
                  className="text-xs"
                  style={{ color: '#8fa0b8' }}
                >
                  Prueba modificando los filtros seleccionados.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      {[
                        'Fecha',
                        'Auxiliar',
                        'Horario del turno',
                        'Actividades',
                        'Estado',
                        'Acción',
                      ].map((col) => (
                        <th
                          key={col}
                          className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                          style={{
                            color: '#8fa0b8',
                            backgroundColor: '#fafbfd',
                            fontSize: 11,
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {informesFiltrados.map((informe, idx) => (
                      <tr
                        key={informe.id}
                        style={{
                          borderBottom:
                            idx < informesFiltrados.length - 1
                              ? '1px solid #f0f4fb'
                              : 'none',
                        }}
                      >
                        {/* FECHA */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                width: 32,
                                height: 32,
                                backgroundColor: B_LIGHT,
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={B_DARK}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                />
                                <line
                                  x1="16"
                                  y1="2"
                                  x2="16"
                                  y2="6"
                                />
                                <line
                                  x1="8"
                                  y1="2"
                                  x2="8"
                                  y2="6"
                                />
                                <line
                                  x1="3"
                                  y1="10"
                                  x2="21"
                                  y2="10"
                                />
                              </svg>
                            </div>

                            <span
                              className="text-sm font-medium"
                              style={{ color: '#111827' }}
                            >
                              {formatearFecha(informe.fecha)}
                            </span>
                          </div>
                        </td>

                        {/* AUXILIAR */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                              style={{
                                width: 32,
                                height: 32,
                                backgroundColor: '#eef4ff',
                                color: B_DARK,
                              }}
                            >
                              {informe.auxiliar
                                .split(' ')
                                .slice(0, 2)
                                .map((nombre) => nombre.charAt(0))
                                .join('')}
                            </div>

                            <span
                              className="text-sm font-medium"
                              style={{ color: '#111827' }}
                            >
                              {informe.auxiliar}
                            </span>
                          </div>
                        </td>

                        {/* HORARIO */}
                        <td className="px-5 py-4">
                          <span
                            className="text-sm font-medium"
                            style={{ color: '#111827' }}
                          >
                            {informe.horarioInicio} -{' '}
                            {informe.horarioFin}
                          </span>
                        </td>

                        {/* ACTIVIDADES */}
                        <td className="px-5 py-4">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: B_LIGHT,
                              color: B_DARK,
                            }}
                          >
                            {informe.actividades}{' '}
                            {informe.actividades === 1
                              ? 'actividad'
                              : 'actividades'}
                          </span>
                        </td>

                        {/* ESTADO */}
                        <td className="px-5 py-4">
                          <span
                            className="flex items-center gap-1.5 text-xs font-medium w-fit px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: '#f0fdf4',
                              color: '#166534',
                            }}
                          >
                            <span
                              className="rounded-full"
                              style={{
                                width: 6,
                                height: 6,
                                backgroundColor: '#16a34a',
                                display: 'inline-block',
                              }}
                            />

                            Guardado
                          </span>
                        </td>

                        {/* ACCIÓN */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                                onNavigate('admin-visualizar', String(informe.id))
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                            style={{
                                border: '1.5px solid #cdd5e0',
                                color: '#111827',
                                backgroundColor: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                '#f1f4f9';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                'transparent';
                            }}
                            >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>

                            Visualizar
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p
            className="text-xs mt-3 text-right"
            style={{ color: '#8fa0b8' }}
          >
            {informesFiltrados.length}{' '}
            {informesFiltrados.length === 1
              ? 'informe'
              : 'informes'}{' '}
            encontrados
          </p>
        </div>
      </main>
    </div>
  );
}