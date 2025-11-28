import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();


/**
 * Proporciona el estado de autenticación y las funciones para iniciar y cerrar sesión a sus componentes hijos.
 * Utiliza el AuthContext para almacenar el estado de autenticación.
 * También almacena el token de autenticación y los datos del usuario en el almacenamiento local.
 * Proporciona tres valores a sus componentes hijos: el token de autenticación, los datos del usuario y dos funciones para iniciar y cerrar sesión.
 * El valor isAuthenticated es un booleano que indica si el usuario está autenticado o no.
 * @example
 * <AuthProvider>
 *   <YourComponent />
 * </AuthProvider>
 * @param {React.ReactNode} children - El contenido de los componentes hijos.
 * @returns {React.ReactNode} - El contenido de los componentes hijos con el contexto de autenticación proporcionado.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });


  // Almacenar el token en el almacenamiento local
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);


  /**
   * Inicia sesión y guarda el token y los datos del usuario en el almacenamiento local.
   * @param {string} tokenValue - El token de autenticación.
   * @param {Object} [userData] - Los datos del usuario.
   * @returns {undefined}
   */
  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData || null);


    localStorage.setItem("token", tokenValue);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
  };


  /**
   * Cierra sesión y elimina el token y los datos del usuario del almacenamiento local.
   * Esta función se utiliza para cerrar sesión y eliminar el token y los datos del usuario del almacenamiento local.
   * No devuelve nada.
   */
  const logout = () => {
    setToken(null);
    setUser(null);


    localStorage.removeItem("token");
    localStorage.removeItem("user");  
  };


  // Proporcionar el estado de autenticación y las funciones para iniciar y cerrar sesión
  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated:!!token}}>
      {children}
    </AuthContext.Provider>
  );
}