import { useState } from 'react';
import type { Informe, Screen } from './types';
import { MOCK_REPORTS } from './data';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import InformeFormScreen from './screens/InformeFormScreen';
import InformesPasadosScreen from './screens/InformesPasadosScreen';
import VisualizarInformeScreen from './screens/VisualizarInformeScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reports, setReports] = useState<Informe[]>(MOCK_REPORTS);

  const navigate = (s: Screen, id?: string) => {
    setScreen(s);
    if (id !== undefined) setSelectedId(id);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');

  setScreen('login');
  setSelectedId(null);
};

  const handleSave = (informe: Informe) => {
    setReports(prev => {
      const exists = prev.find(r => r.id === informe.id);
      if (exists) {
        return prev.map(r => r.id === informe.id ? informe : r);
      }
      return [informe, ...prev];
    });
  };

  const selectedReport = selectedId ? reports.find(r => r.id === selectedId) ?? null : null;

  switch (screen) {
    case 'login':
      return <LoginScreen onLogin={navigate} />;

    case 'dashboard':
      return <DashboardScreen onNavigate={navigate} onLogout={handleLogout} />;

    case 'elaborar':
      return (
        <InformeFormScreen
          onNavigate={navigate}
          onLogout={handleLogout}
          onSave={handleSave}
          editReport={null}
        />
      );

    case 'editar':
      return (
        <InformeFormScreen
          onNavigate={navigate}
          onLogout={handleLogout}
          onSave={handleSave}
          editReport={selectedReport}
        />
      );

    case 'informes':
      return (
        <InformesPasadosScreen
          reports={reports}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );

    case 'visualizar':
      if (!selectedReport) {
        navigate('informes');
        return null;
      }
      return (
        <VisualizarInformeScreen
          informe={selectedReport}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );

    default:
      return null;
  }
}
