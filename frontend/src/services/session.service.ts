
export function cerrarSesion(): void {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('usuario');
  sessionStorage.removeItem('screen');

  window.dispatchEvent(new Event('sesion-expirada'));
}

export function verificarSesion(response: Response): void {
  if (response.status === 401) {
    cerrarSesion();
    throw new Error(
      'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    );
  }
}
