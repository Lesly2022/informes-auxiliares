export interface Usuario {
  id: number;
  codigoSiss: string;
  nombreCompleto: string;
  cargo: string;
  rol: string;
  horarioInicio: string;
  horarioFin: string;
}

interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

const API_URL = 'http://localhost:3000/api';

export async function login(
  codigoSiss: string,
  carnet: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      codigoSiss,
      carnet,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'No se pudo iniciar sesión');
  }

  return data;
}