import { useEffect, useState } from 'react';
import type { Screen } from '../types';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { obtenerPerfil, type Perfil } from '../services/perfil.service';

interface Props {
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

function formatearTurnos(
  turnos: Array<{
    dia: string;
    horarioInicio: string;
    horarioFin: string;
  }>
): string[] {
  if (!turnos || turnos.length === 0) {
    return [];
  }

  const ordenDias = [
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
  ];

  const nombresDias: Record<string, string> = {
    LUNES: 'Lunes',
    MARTES: 'Martes',
    MIERCOLES: 'Miércoles',
    JUEVES: 'Jueves',
    VIERNES: 'Viernes',
    SABADO: 'Sábado',
  };

  const grupos = new Map<string, string[]>();

  [...turnos]
    .sort(
      (a, b) =>
        ordenDias.indexOf(a.dia) - ordenDias.indexOf(b.dia)
    )
    .forEach((turno) => {
      const horario =
        `${turno.horarioInicio} - ${turno.horarioFin}`;

      const dias = grupos.get(horario) || [];
      dias.push(turno.dia);
      grupos.set(horario, dias);
    });

  return Array.from(grupos.entries()).map(([horario, dias]) => {
    const indices = dias.map((dia) => ordenDias.indexOf(dia));

    const consecutivos = indices.every(
      (indice, posicion) =>
        posicion === 0 ||
        indice === indices[posicion - 1] + 1
    );

    let textoDias: string;

    if (dias.length >= 3 && consecutivos) {
      textoDias =
        `${nombresDias[dias[0]]} a ${nombresDias[dias[dias.length - 1]]}`;
    } else {
      textoDias = dias
        .map((dia) => nombresDias[dia])
        .join(', ');
    }

    return `${textoDias}: ${horario}`;
  });
}

export default function DashboardScreen({ onNavigate, onLogout }: Props) {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await obtenerPerfil();
        setPerfil(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('No se pudo cargar el perfil.');
        }
      }
    };

    cargarPerfil();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando información...</p>
      </div>
    );
  }

  const initials = perfil.nombreCompleto
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('');

  const turnosFormateados = perfil
  ? formatearTurnos(perfil.turnos)
  : [];  

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Sidebar active="dashboard" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 flex flex-col" style={{ backgroundColor: '#f1f4f9' }}>
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-8 py-4 border-b"
          style={{ backgroundColor: 'white', borderColor: '#e2e8f0' }}
        >
          <div className="flex items-center gap-3">
          <div
            className="rounded-lg overflow-hidden shrink-0"
            style={{
              width: 42,
              height: 42,
              backgroundColor: 'white',
            }}
          >
            <img
              src="/logo-informes.jpeg"
              alt="SILAB"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div>
            <h1
              className="font-semibold text-base"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#111827',
              }}
            >
              SILAB - Sistema de Informes de Laboratorio
            </h1>

            <p
              className="text-xs mt-0.5"
              style={{ color: '#5a6a82' }}
            >
              Laboratorios de Informática y Sistemas · UMSS
            </p>
          </div>
        </div>
          <div className="flex items-center gap-2.5">
            <div
              className="rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`, fontFamily: 'DM Sans, sans-serif' }}
            >
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium" style={{ color: '#111827' }}>{perfil.nombreCompleto}</p>
              <p className="text-xs" style={{ color: '#5a6a82' }}>{perfil.cargo}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-8 py-8 max-w-5xl w-full mx-auto">
          <div className="mb-7">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif', color: '#111827' }}>
              Bienvenido, {perfil.nombreCompleto.split(' ')[0]}
            </h2>
            <p className="text-sm mt-1" style={{ color: '#5a6a82' }}>
              Aquí puedes registrar y consultar tus informes diarios de laboratorio.
            </p>
          </div>

          {/* Auxiliar card */}
          <div
            className="rounded-xl p-6 mb-7"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-start gap-4">
              <div
                className="rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                style={{ width: 52, height: 52, background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`, fontFamily: 'DM Sans, sans-serif' }}
              >
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-base" style={{ fontFamily: 'DM Sans, sans-serif', color: '#111827' }}>
                    Datos del auxiliar
                  </h3>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                  >
                    Activo
                  </span>
                </div>
                <div
                    className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.2fr_0.8fr_1.7fr]"
                  >
                  {[
                    { label: 'Nombre completo', value: perfil.nombreCompleto },
                    { label: 'Cargo', value: perfil.cargo },
                    { label: 'Código SISS', value: perfil.codigoSiss },
                    {
                      label: 'Turnos',
                      value:
                        turnosFormateados.length > 0
                          ? turnosFormateados
                          : [`${perfil.horarioInicio} - ${perfil.horarioFin}`],
                    },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ color: '#8fa0b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>
                        {label}
                      </p>
                      {Array.isArray(value) ? (
                      <div className="space-y-1.5">
                        {value.map((linea) => (
                          <p
                            key={linea}
                            className="text-sm font-medium whitespace-nowrap"
                            style={{
                              color: '#111827',
                              lineHeight: 1.45,
                            }}
                          >
                            {linea}
                          </p>
                        ))}
                      </div>
                      ) : (
                        <p
                          className="text-sm font-medium"
                          style={{ color: '#111827' }}
                        >
                          {value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Elaborar */}
            <div
              className="rounded-xl p-6 flex flex-col"
              style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <div
                className="rounded-xl flex items-center justify-center mb-4"
                style={{ width: 48, height: 48, backgroundColor: B_LIGHT }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={B_DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <h3 className="font-semibold text-base mb-1.5" style={{ fontFamily: 'DM Sans, sans-serif', color: '#111827' }}>
                Elaborar informe
              </h3>
              <p className="text-sm flex-1 mb-5" style={{ color: '#5a6a82' }}>
                Registra las actividades realizadas durante tu turno de trabajo.
              </p>
              <button
                onClick={() => onNavigate('elaborar')}
                className="w-full rounded-lg py-2.5 text-sm font-semibold text-white"
                style={{ background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`, fontFamily: 'DM Sans, sans-serif', boxShadow: '0 2px 8px rgba(37,84,168,0.28)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                Elaborar informe
              </button>
            </div>

            {/* Informes pasados */}
            <div
              className="rounded-xl p-6 flex flex-col"
              style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <div
                className="rounded-xl flex items-center justify-center mb-4"
                style={{ width: 48, height: 48, backgroundColor: B_LIGHT }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={B_DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3 className="font-semibold text-base mb-1.5" style={{ fontFamily: 'DM Sans, sans-serif', color: '#111827' }}>
                Informes pasados
              </h3>
              <p className="text-sm flex-1 mb-5" style={{ color: '#5a6a82' }}>
                Consulta, visualiza y edita los informes registrados anteriormente.
              </p>
              <button
                onClick={() => onNavigate('informes')}
                className="w-full rounded-lg py-2.5 text-sm font-semibold"
                style={{ border: `1.5px solid ${B_MID}`, color: B_MID, backgroundColor: 'transparent', fontFamily: 'DM Sans, sans-serif' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = B_LIGHT; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                Ver informes
              </button>
            </div>
                 </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
