import { useState } from 'react';
import type { Screen } from './types';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import InformeFormScreen from './screens/InformeFormScreen';
import InformesPasadosScreen from './screens/InformesPasadosScreen';
import VisualizarInformeScreen from './screens/VisualizarInformeScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const navigate = (s: Screen, id?: string) => {
    setScreen(s);

    if (id !== undefined) {
      setSelectedId(id);
    }

    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    setScreen('login');
    setSelectedId(null);
  };

  switch (screen) {
    case 'login':
      return (
        <LoginScreen
          onLogin={navigate}
        />
      );

    case 'dashboard':
      return (
        <DashboardScreen
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );

    case 'elaborar':
      return (
        <InformeFormScreen
          onNavigate={navigate}
          onLogout={handleLogout}
          editReportId={null}
        />
      );

    case 'editar':
      if (!selectedId) {
        return (
          <InformesPasadosScreen
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        );
      }

      return (
        <InformeFormScreen
          onNavigate={navigate}
          onLogout={handleLogout}
          editReportId={selectedId}
        />
      );

    case 'informes':
      return (
        <InformesPasadosScreen
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );

    case 'visualizar':
      if (!selectedId) {
        return (
          <InformesPasadosScreen
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        );
      }

      return (
        <VisualizarInformeScreen
          informeId={selectedId}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );

    default:
      return null;
  }
}