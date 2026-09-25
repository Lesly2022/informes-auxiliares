import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import type { AdminScreen } from '../../types';
import {
  obtenerAdminDashboard,
  formatearFechaAdmin,
  obtenerHorarioAdmin,
  type AdminDashboardResponse,
} from '../../services/admin.service';

interface Props {
  onNavigate: (screen: AdminScreen, id?: string) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2855a5';
const B_LIGHT = '#eef4ff';

function StatCard({
  titulo,
  valor,
  descripcion,
  icono,
}: {
  titulo: string;
  valor: number;
  descripcion: string;
  icono: 'users' | 'active' | 'reports';
}) {
  const getIcon = () => {
    if (icono === 'users') {
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    }

    if (icono === 'active') {
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    }

    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    );
  };

  return (
    <div
      className="bg-white rounded-xl border p-5 flex items-center gap-4"
      style={{ borderColor: '#e5eaf2' }}
    >
      <div
        className="rounded-xl flex items-center justify-center shrink-0"
        style={{
          width: 48,
          height: 48,
          backgroundColor: B_LIGHT,
          color: B_MID,
        }}
      >
        {getIcon()}
      </div>

      <div>
        <div
          className="text-2xl font-bold"
          style={{
            color: '#172033',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {valor}
        </div>

        <div
          className="text-sm font-semibold"
          style={{ color: '#354158' }}
        >
          {titulo}
        </div>

        <div
          className="text-xs mt-0.5"
          style={{ color: '#8993a5' }}
        >
          {descripcion}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardScreen({
  onNavigate,
  onLogout,
}: Props) {
  const [dashboard, setDashboard] =
    useState<AdminDashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarDashboard() {
      try {
        setLoading(true);
        setError('');

        const data = await obtenerAdminDashboard();

        setDashboard(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(
            'No se pudieron obtener los datos del dashboard.'
          );
        }
      } finally {
        setLoading(false);
      }
    }

    cargarDashboard();
  }, []);

  const resumen = dashboard?.resumen;

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: '#f6f8fc' }}
    >
      <AdminSidebar
        active="admin-dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 min-w-0">
        {/* Encabezado */}
        <header
          className="bg-white border-b px-8 py-5"
          style={{ borderColor: '#e5eaf2' }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1
                className="text-xl font-bold"
                style={{
                  color: '#172033',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Panel de administración
              </h1>

              <p
                className="text-sm mt-1"
                style={{ color: '#7a8496' }}
              >
                Gestión de informes y recursos del Laboratorio de Informática y Sistemas
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
          </div>
        </header>

        <div className="p-8">
          {/* Bienvenida */}
          <div className="mb-7">
            <h2
              className="text-2xl font-bold"
              style={{
                color: '#172033',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Resumen general
            </h2>

            <p
              className="text-sm mt-1"
              style={{ color: '#7a8496' }}
            >
              Información general del sistema de informes diarios.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-lg border text-sm"
              style={{
                backgroundColor: '#fff5f5',
                borderColor: '#fecaca',
                color: '#b91c1c',
              }}
            >
              {error}
            </div>
          )}

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              titulo="Auxiliares"
              valor={resumen?.totalAuxiliares ?? 0}
              descripcion="Registrados en el sistema"
              icono="users"
            />

            <StatCard
              titulo="Auxiliares activos"
              valor={resumen?.auxiliaresActivos ?? 0}
              descripcion="Con acceso habilitado"
              icono="active"
            />

            <StatCard
              titulo="Informes"
              valor={resumen?.totalInformes ?? 0}
              descripcion="Informes registrados"
              icono="reports"
            />
          </div>

          {/* Últimos informes */}
          <section
            className="bg-white rounded-xl border overflow-hidden"
            style={{ borderColor: '#e5eaf2' }}
          >
            <div
              className="px-6 py-5 border-b flex items-center justify-between gap-4"
              style={{ borderColor: '#e5eaf2' }}
            >
              <div>
                <h3
                  className="font-bold"
                  style={{
                    color: '#172033',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Últimos informes
                </h3>

                <p
                  className="text-xs mt-1"
                  style={{ color: '#8993a5' }}
                >
                  Los 5 informes más recientes enviados por los auxiliares
                </p>
              </div>

              <button
                onClick={() => onNavigate('admin-informes')}
                className="text-sm font-semibold px-3 py-2 rounded-lg"
                style={{
                  color: B_MID,
                  backgroundColor: B_LIGHT,
                }}
              >
                Ver todos
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f8f9fc',
                      color: '#6f7a8d',
                    }}
                  >
                    <th className="text-left text-xs font-semibold px-6 py-3">
                      Fecha
                    </th>

                    <th className="text-left text-xs font-semibold px-6 py-3">
                      Auxiliar
                    </th>

                    <th className="text-left text-xs font-semibold px-6 py-3">
                      Horario
                    </th>

                    <th className="text-center text-xs font-semibold px-6 py-3">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-sm"
                        style={{ color: '#8993a5' }}
                      >
                        Cargando informes...
                      </td>
                    </tr>
                  ) : dashboard &&
                    dashboard.informesRecientes.length > 0 ? (
                    dashboard.informesRecientes.map((informe) => {
                      const nombreAuxiliar =
                        informe.usuario?.nombreCompleto ||
                        'Auxiliar';

                      const iniciales = nombreAuxiliar
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((nombre) => nombre.charAt(0))
                        .join('')
                        .toUpperCase();

                      return (
                        <tr
                          key={informe.id}
                          className="border-t"
                          style={{ borderColor: '#edf0f5' }}
                        >
                          <td
                            className="px-6 py-4 text-sm"
                            style={{ color: '#536076' }}
                          >
                            {formatearFechaAdmin(informe.fecha)}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                                style={{
                                  width: 34,
                                  height: 34,
                                  backgroundColor: B_LIGHT,
                                  color: B_DARK,
                                }}
                              >
                                {iniciales}
                              </div>

                              <span
                                className="text-sm font-medium"
                                style={{ color: '#26354d' }}
                              >
                                {nombreAuxiliar}
                              </span>
                            </div>
                          </td>

                          <td
                            className="px-6 py-4 text-sm"
                            style={{ color: '#536076' }}
                          >
                            {obtenerHorarioAdmin(informe)}
                          </td>

                          <td className="px-6 py-4 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                onNavigate(
                                  'admin-visualizar',
                                  String(informe.id)
                                )
                              }
                              className="text-sm font-semibold px-3 py-1.5 rounded-lg"
                              style={{
                                color: B_MID,
                                backgroundColor: B_LIGHT,
                              }}
                            >
                              Ver informe
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-sm"
                        style={{ color: '#8993a5' }}
                      >
                        No existen informes registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Accesos rápidos */}
          <section className="mt-8">
            <h3
              className="font-bold mb-4"
              style={{
                color: '#172033',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Gestión rápida
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => onNavigate('admin-auxiliares')}
                className="bg-white border rounded-xl p-5 text-left"
                style={{ borderColor: '#e5eaf2' }}
              >
                <div
                  className="font-semibold text-sm"
                  style={{ color: '#26354d' }}
                >
                  Gestionar auxiliares
                </div>

                <div
                  className="text-xs mt-1"
                  style={{ color: '#8993a5' }}
                >
                  Registrar, editar, activar o desactivar auxiliares.
                </div>
              </button>

              <button
                onClick={() => onNavigate('admin-docentes')}
                className="bg-white border rounded-xl p-5 text-left"
                style={{ borderColor: '#e5eaf2' }}
              >
                <div
                  className="font-semibold text-sm"
                  style={{ color: '#26354d' }}
                >
                  Gestionar docentes
                </div>

                <div
                  className="text-xs mt-1"
                  style={{ color: '#8993a5' }}
                >
                  Administrar los docentes disponibles en los informes.
                </div>
              </button>

              <button
                onClick={() => onNavigate('admin-salas')}
                className="bg-white border rounded-xl p-5 text-left"
                style={{ borderColor: '#e5eaf2' }}
              >
                <div
                  className="font-semibold text-sm"
                  style={{ color: '#26354d' }}
                >
                  Gestionar salas
                </div>

                <div
                  className="text-xs mt-1"
                  style={{ color: '#8993a5' }}
                >
                  Administrar laboratorios y salas disponibles.
                </div>
              </button>
            </div>
          </section>
                </div>

        <Footer />
      </main>
    </div>
  );
}