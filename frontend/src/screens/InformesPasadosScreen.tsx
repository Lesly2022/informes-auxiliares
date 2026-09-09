import { useState } from 'react';
import type { Informe, Screen } from '../types';
import { formatFecha, countActividades } from '../data';
import Sidebar from '../components/Sidebar';

interface Props {
  reports: Informe[];
  onNavigate: (s: Screen, id?: string) => void;
  onLogout: () => void;
}

const B_DARK = '#1a3d7c';
const B_MID = '#2554a8';
const B_LIGHT = '#e8eef8';

export default function InformesPasadosScreen({ reports, onNavigate, onLogout }: Props) {
  const [search, setSearch] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const filtered = reports.filter(r => {
    const fechaStr = formatFecha(r.fecha);
    const matchSearch = !search || fechaStr.includes(search) || r.horario.toLowerCase().includes(search.toLowerCase());
    const matchDesde = !desde || r.fecha >= desde;
    const matchHasta = !hasta || r.fecha <= hasta;
    return matchSearch && matchDesde && matchHasta;
  });

  const inputBase: React.CSSProperties = {
    border: '1.5px solid #cdd5e0',
    backgroundColor: '#f8fafc',
    color: '#111827',
    borderRadius: 8,
    padding: '7px 12px',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Sidebar active="informes" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 flex flex-col" style={{ backgroundColor: '#f1f4f9' }}>
        <header className="flex items-center justify-between px-8 py-4 border-b" style={{ backgroundColor: 'white', borderColor: '#e2e8f0' }}>
          <div>
            <h1 className="font-semibold text-base" style={{ fontFamily: 'DM Sans, sans-serif', color: '#111827' }}>
              Informes Pasados
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#5a6a82' }}>Consulta los informes registrados anteriormente.</p>
          </div>
          <button
            onClick={() => onNavigate('elaborar')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${B_DARK} 0%, ${B_MID} 100%)`, fontFamily: 'DM Sans, sans-serif', boxShadow: '0 2px 8px rgba(37,84,168,0.28)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Elaborar nuevo informe
          </button>
        </header>

        <div className="flex-1 px-8 py-6">
          {/* Filters */}
          <div
            className="rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Buscar por fecha o horario</label>
              <div className="relative">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8fa0b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por fecha…"
                  style={{ ...inputBase, paddingLeft: 32 }}
                  onFocus={e => { e.currentTarget.style.borderColor = B_MID; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#cdd5e0'; }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Desde</label>
              <input type="date" value={desde} onChange={e => setDesde(e.target.value)} style={inputBase}
                onFocus={e => { e.currentTarget.style.borderColor = B_MID; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#cdd5e0'; }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#5a6a82' }}>Hasta</label>
              <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} style={inputBase}
                onFocus={e => { e.currentTarget.style.borderColor = B_MID; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#cdd5e0'; }}
              />
            </div>
            {(search || desde || hasta) && (
              <button
                onClick={() => { setSearch(''); setDesde(''); setHasta(''); }}
                className="px-3 py-2 rounded-lg text-xs font-medium self-end"
                style={{ color: '#5a6a82', backgroundColor: '#f1f4f9' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#e2e8f0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f4f9'; }}
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-xl flex items-center justify-center mb-4" style={{ width: 52, height: 52, backgroundColor: '#f1f4f9' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8fa0b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: '#5a6a82' }}>No se encontraron informes</p>
                <p className="text-xs" style={{ color: '#8fa0b8' }}>Ajusta los filtros o elabora un nuevo informe.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    {['Fecha', 'Horario del turno', 'Actividades', 'Estado', 'Acciones'].map(col => (
                      <th key={col} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: '#8fa0b8', backgroundColor: '#fafbfd', fontSize: 11 }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={r.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f0f4fb' : 'none' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, backgroundColor: B_LIGHT }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B_DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                          </div>
                          <span className="text-sm font-medium" style={{ color: '#111827' }}>{formatFecha(r.fecha)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium" style={{ color: '#111827' }}>{r.horario}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: B_LIGHT, color: B_DARK }}>
                          {countActividades(r)} {countActividades(r) === 1 ? 'actividad' : 'actividades'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium w-fit px-2.5 py-1 rounded-full" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                          <span className="rounded-full" style={{ width: 6, height: 6, backgroundColor: '#16a34a', display: 'inline-block' }} />
                          {r.estado}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onNavigate('visualizar', r.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                            style={{ border: '1.5px solid #cdd5e0', color: '#111827', backgroundColor: 'transparent' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f4f9'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                            Visualizar
                          </button>
                          <button
                            onClick={() => onNavigate('editar', r.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                            style={{ backgroundColor: B_LIGHT, color: B_DARK, border: `1.5px solid #d1ddf5` }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#d1ddf5'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = B_LIGHT; }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <p className="text-xs mt-3 text-right" style={{ color: '#8fa0b8' }}>
            {filtered.length} {filtered.length === 1 ? 'informe' : 'informes'} encontrados
          </p>
        </div>
      </main>
    </div>
  );
}
