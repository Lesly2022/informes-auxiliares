export interface Usuario {
  id: number;
  codigoSiss?: string;
  username?: string;
  nombreCompleto: string;
  cargo: string;
  rol: 'ADMIN' | 'AUXILIAR';
  horarioInicio?: string;
  horarioFin?: string;
  activo?: boolean;
}

interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

const API_URL = 'http://localhost:3000/api';

export async function login(
  usuario: string,
  password: string,
): Promise<LoginResponse> {
  const usuarioLimpio = usuario.trim();
  const passwordLimpio = password.trim();

  const body =
    usuarioLimpio.toLowerCase() === 'admin'
      ? {
          username: usuarioLimpio,
          password: passwordLimpio,
        }
      : {
          codigoSiss: usuarioLimpio,
          carnet: passwordLimpio,
        };

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('El servidor devolvió una respuesta no válida.');
  }

  if (!response.ok) {
    throw new Error(
      data.mensaje ||
        data.error ||
        'No se pudo iniciar sesión.',
    );
  }

  return data;
}