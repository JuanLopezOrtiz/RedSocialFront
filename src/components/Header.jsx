// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Header.css";

/**
 * Componente que renderiza la barra de navegación superior.
 * Muestra el nombre de la red, enlaces de navegación y el usuario logueado
 * con un botón para cerrar sesión.
 * @returns {JSX.Element} Barra de navegación superior.
 */
export default function Header() {
  const { user, logout } = useAuth();


  return (
    <header className="app-header">
      {/* Izquierda: nombre de la red */}
      <h2 className="app-logo">1ªRed</h2>


      {/* Centro: enlaces de navegación */}
      <nav className="app-nav">
        <Link to="/">Inicio</Link>
        <Link to="/all">Todas</Link>
        <Link to="/me">Mi perfil</Link>
      </nav>


      {/* Derecha: usuario logueado + botón logout */}
      <div className="user-session">
        <span className="user-name">
          {user?.username ?? "Usuario"}
        </span>
        <button className="logout-button" onClick={logout}>Cerrar sesión</button>
      </div>
    </header>
  );
}


