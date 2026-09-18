import { useEffect, useState } from 'react';
import type { Screen } from '../types';
import Sidebar from '../components/Sidebar';
import { obtenerPerfil, type Perfil } from '../services/perfil.service';

interface Props {
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

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

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Sidebar active="dashboard" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 flex flex-col" style={{ backgroundColor: '#f1f4f9' }}>
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-8 py-4 border-b"
          style={{ backgroundColor: 'white', borderColor: '#e2e8f0' }}
        >
          <div>
            <h1 className="font-semibold text-base" style={{ fontFamily: 'DM Sans, sans-serif', color: '#111827' }}>
              Sistema de Informes Diarios
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#5a6a82' }}>
              Laboratorios de Cómputo – Informática y Sistemas · UMSS
            </p>
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
              <p className="text-xs" style={{ color: '#5a6a82' }}>{perfil.nombreCompleto}</p>
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
                className="rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
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
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
                  {[
                    { label: 'Nombre completo', value: perfil.nombreCompleto },
                    { label: 'Cargo', value: perfil.cargo },
                    { label: 'Código SISS', value: perfil.codigoSiss },
                    {
                      label: 'Horario',
                      value: `${perfil.horarioInicio} - ${perfil.horarioFin}`,
                    },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ color: '#8fa0b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>
                        {label}
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#111827' }}>{value}</p>
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
      </main>
    </div>
  );
}
