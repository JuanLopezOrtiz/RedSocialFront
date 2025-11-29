import { apiFetch } from "./client";


/**
 * Registra un nuevo usuario.
 * @param {{username: string, password: string }} data
 */
export function registerUser(data) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


/**
 * Inicia sesión y obtiene el token JWT.
 * @param {{ username: string, password: string }} data
 */

/**
 * Inicia sesión y obtiene el token JWT.
 * Realiza un POST a /auth/login con los datos del usuario.
 * Devuelve una promesa que se resuelve con el token JWT si la autenticación es exitosa.
 * @param {{username: string, password: string}} data - Datos del usuario para iniciar sesión.
 * @returns {Promise<string>} Token JWT si la autenticación es exitosa.
 */
export function loginUser(data) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
