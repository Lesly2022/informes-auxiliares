import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import type { AdminScreen } from '../../types';
import {
  obtenerAdminAuxiliares,
  obtenerAdminInformes,
  formatearFechaAdmin,
  type AdminAuxiliar,
  type AdminInformeResumen,
  type AdminFiltrosInformes,
} from '../../services/admin.service';

interface Props {
  onNavigate: (screen: AdminScreen, id?: string) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_LIGHT = '#e8eef8';

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

export default function AdminInformesScreen({
  onNavigate,
  onLogout,
}: Props) {
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [auxiliarId, setAuxiliarId] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [informes, setInformes] = useState<AdminInformeResumen[]>([]);
  const [auxiliares, setAuxiliares] = useState<AdminAuxiliar[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // ==========================================
  // AÑOS DISPONIBLES
  // ==========================================

  const anios = useMemo(() => {
    const anioActual = new Date().getFullYear();

    const aniosInformes = informes.map((informe) =>
      Number(informe.fecha.substring(0, 4))
    );

    const lista = Array.from(
      new Set([
        anioActual,
        anioActual - 1,
        anioActual - 2,
        ...aniosInformes,
      ])
    );

    return lista.sort((a, b) => b - a);
  }, [informes]);

  // ==========================================
  // CONSTRUIR FILTROS PARA EL BACKEND
  // ==========================================

  const construirFiltros = (): AdminFiltrosInformes => {
    const filtros: AdminFiltrosInformes = {};

    if (auxiliarId) {
      filtros.auxiliarId = Number(auxiliarId);
    }

    /*
     * Si tenemos día + mes + año, enviamos una fecha completa.
     * Ejemplo: 18 + 9 + 2026 => 2026-09-18
     */
    if (dia && mes && anio) {
      const mesFormateado = mes.padStart(2, '0');
      const diaFormateado = dia.padStart(2, '0');

      filtros.fecha = `${anio}-${mesFormateado}-${diaFormateado}`;

      return filtros;
    }

    /*
     * Si tenemos mes + año, usamos ambos filtros.
     */
    if (mes && anio) {
      filtros.mes = Number(mes);
      filtros.anio = Number(anio);

      return filtros;
    }

    /*
     * Si únicamente tenemos año, filtramos por año.
     */
    if (anio) {
      filtros.anio = Number(anio);
    }

    return filtros;
  };

  // ==========================================
  // CARGAR AUXILIARES
  // ==========================================

  useEffect(() => {
    const cargarAuxiliares = async () => {
      try {
        const data = await obtenerAdminAuxiliares();
        setAuxiliares(data);
      } catch (err) {
        console.error('Error al cargar auxiliares:', err);
      }
    };

    cargarAuxiliares();
  }, []);

  // ==========================================
  // CARGAR INFORMES
  // ==========================================

  useEffect(() => {
    const cargarInformes = async () => {
      try {
        setCargando(true);
        setError('');

        const filtros = construirFiltros();

        const data = await obtenerAdminInformes(filtros);

        setInformes(data);
      } catch (err) {
        console.error('Error al cargar informes:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los informes'
        );

        setInformes([]);
      } finally {
        setCargando(false);
      }
    };

    cargarInformes();
  }, [dia, mes, anio, auxiliarId]);

  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================

  const hayFiltros = Boolean(dia || mes || anio || auxiliarId);

  const limpiarFiltros = () => {
    setDia('');
    setMes('');
    setAnio('');
    setAuxiliarId('');
  };

  const abrirImpresion = () => {
      if (!fechaDesde || !fechaHasta) {
        return;
      }

      if (fechaDesde > fechaHasta) {
        alert('La fecha inicial no puede ser posterior a la fecha final.');
        return;
      }

      localStorage.setItem('adminPrintFechaDesde', fechaDesde);
      localStorage.setItem('adminPrintFechaHasta', fechaHasta);

      if (auxiliarId) {
        localStorage.setItem('adminPrintAuxiliarId', auxiliarId);
      } else {
        localStorage.removeItem('adminPrintAuxiliarId');
      }

      onNavigate('admin-imprimir');
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
              Laboratorio de Informática y Sistemas
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
                    )
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
                    <option key={auxiliar.id} value={auxiliar.id}>
                      {auxiliar.nombreCompleto}
                      {!auxiliar.activo ? ' (Inactivo)' : ''}
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

            {/* MENSAJE SEMANA ACTUAL */}
            {auxiliarId && !dia && !mes && !anio && (
              <p
                className="text-xs mt-3"
                style={{ color: '#5a6a82' }}
              >
                Mostrando los informes de la semana actual del auxiliar
                seleccionado.
              </p>
            )}

            {/* AYUDA PARA DÍA */}
            {dia && (!mes || !anio) && (
              <p
                className="text-xs mt-3"
                style={{ color: '#b45309' }}
              >
                Para filtrar por un día específico, selecciona también el mes
                y el año.
              </p>
            )}

            {/* AYUDA PARA MES */}
            {mes && !anio && (
              <p
                className="text-xs mt-3"
                style={{ color: '#b45309' }}
              >
                Para filtrar por mes, selecciona también el año.
              </p>
            )}

            {/* IMPRESIÓN POR RANGO */}
            <div
              className="mt-5 pt-5"
              style={{
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: '#111827' }}
                  >
                    Imprimir informes
                  </h3>

                  <p
                    className="text-xs mt-1"
                    style={{ color: '#8fa0b8' }}
                  >
                    Selecciona un rango de fechas para imprimir los informes.
                  </p>
                </div>

                <div className="flex items-end gap-3 flex-wrap">
                  {/* FECHA DESDE */}
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-xs font-medium"
                      style={{ color: '#5a6a82' }}
                    >
                      Fecha desde
                    </label>

                    <input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      style={inputBase}
                    />
                  </div>

                  {/* FECHA HASTA */}
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-xs font-medium"
                      style={{ color: '#5a6a82' }}
                    >
                      Fecha hasta
                    </label>

                    <input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      style={inputBase}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={abrirImpresion}
                    disabled={!fechaDesde || !fechaHasta}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                    style={{
                      backgroundColor:
                        fechaDesde && fechaHasta ? B_DARK : '#94a3b8',
                      minHeight: 36,
                      cursor:
                        fechaDesde && fechaHasta
                          ? 'pointer'
                          : 'not-allowed',
                    }}
                  >
                    Imprimir informes
                  </button>
                </div>
              </div>
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
                  {cargando
                    ? 'Cargando informes...'
                    : `${informes.length} ${
                        informes.length === 1
                          ? 'informe encontrado'
                          : 'informes encontrados'
                      }`}
                </p>
              </div>
            </div>

            {/* CARGANDO */}
            {cargando ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="rounded-full mb-4"
                  style={{
                    width: 30,
                    height: 30,
                    border: '3px solid #e2e8f0',
                    borderTopColor: B_DARK,
                    animation: 'spin 0.8s linear infinite',
                  }}
                />

                <p
                  className="text-sm font-medium"
                  style={{ color: '#5a6a82' }}
                >
                  Cargando informes...
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
            ) : error ? (
              /* ERROR */
              <div className="flex flex-col items-center justify-center py-16 text-center px-5">
                <div
                  className="rounded-xl flex items-center justify-center mb-4"
                  style={{
                    width: 52,
                    height: 52,
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  !
                </div>

                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: '#b91c1c' }}
                >
                  No se pudieron cargar los informes
                </p>

                <p
                  className="text-xs"
                  style={{ color: '#8fa0b8' }}
                >
                  {error}
                </p>
              </div>
            ) : informes.length === 0 ? (
              /* SIN RESULTADOS */
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
                  No existen informes que coincidan con los filtros
                  seleccionados.
                </p>
              </div>
            ) : (
              /* RESULTADOS */
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
                    {informes.map((informe, idx) => (
                      <tr
                        key={informe.id}
                        style={{
                          borderBottom:
                            idx < informes.length - 1
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
                              {formatearFechaAdmin(informe.fecha)}
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
                              {informe.usuario.nombreCompleto
                                .split(' ')
                                .slice(0, 2)
                                .map((nombre) => nombre.charAt(0))
                                .join('')}
                            </div>

                            <div>
                              <span
                                className="text-sm font-medium block"
                                style={{ color: '#111827' }}
                              >
                                {informe.usuario.nombreCompleto}
                              </span>

                              {informe.usuario.codigoSiss && (
                                <span
                                  className="text-xs"
                                  style={{ color: '#8fa0b8' }}
                                >
                                  SISS: {informe.usuario.codigoSiss}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* HORARIO */}
                        <td className="px-5 py-4">
                          <span
                            className="text-sm font-medium"
                            style={{ color: '#111827' }}
                          >
                            {informe.horarioInicio} - {informe.horarioFin}
                          </span>

                          {informe.horarioModificado && (
                            <div
                              className="text-xs mt-1"
                              style={{ color: '#b45309' }}
                            >
                              Horario modificado
                            </div>
                          )}
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

                            {informe.estado === 'GUARDADO'
                              ? 'Guardado'
                              : informe.estado}
                          </span>
                        </td>

                        {/* ACCIÓN */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              onNavigate(
                                'admin-visualizar',
                                String(informe.id)
                              )
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

          {!cargando && !error && (
            <p
              className="text-xs mt-3 text-right"
              style={{ color: '#8fa0b8' }}
            >
              {informes.length}{' '}
              {informes.length === 1 ? 'informe' : 'informes'} encontrados
            </p>
          )}
                </div>

        <Footer />
      </main>
    </div>
  );
}