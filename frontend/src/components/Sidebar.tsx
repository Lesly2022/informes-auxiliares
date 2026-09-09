import type { Screen } from '../types';

interface SidebarProps {
  active: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const navItems: { label: string; screen: Screen; icon: string }[] = [
  { label: 'Inicio', screen: 'dashboard', icon: 'home' },
  { label: 'Elaborar informe', screen: 'elaborar', icon: 'edit' },
  { label: 'Informes pasados', screen: 'informes', icon: 'list' },
  { label: 'Mi perfil', screen: 'dashboard', icon: 'user' },
];

function Icon({ name }: { name: string }) {
  switch (name) {
    case 'home':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    case 'edit':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      );
    case 'list':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      );
    case 'user':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      );
    case 'logout':
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      );
    default: return null;
  }
}

const SIDEBAR_BG = '#1a3d7c';

export default function Sidebar({ active, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside
      style={{ backgroundColor: SIDEBAR_BG, minHeight: '100vh', width: 220, flexShrink: 0 }}
      className="flex flex-col"
    >
      {/* Brand */}
      <div className="px-5 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.14)', width: 36, height: 36 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Informes Diarios
            </div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>Lab. Cómputo · UMSS</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
        {navItems.map(item => {
          const isActive =
            (item.screen === 'dashboard' && item.label === 'Inicio' && active === 'dashboard') ||
            (item.screen !== 'dashboard' && active === item.screen) ||
            (item.label === 'Mi perfil' && false);
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left"
              style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.16)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.68)',
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <span style={{ opacity: isActive ? 1 : 0.72 }}><Icon name={item.icon} /></span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left"
          style={{ color: 'rgba(255,255,255,0.62)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.62)'; }}
        >
          <Icon name="logout" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
