import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Hook para obtener el contexto de autenticación.
 * Devuelve el estado de autenticación actual.
 * @returns {{token: string, user: Object, login: function, logout: function}}
 * @example
 * const { token, user, login, logout } = useAuth();
 */
export function useAuth() {
  return useContext(AuthContext);
}
