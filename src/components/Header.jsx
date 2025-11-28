import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Header.css";

import { useRef, useEffect } from "react"; 
import { gsap } from "gsap"; 

/**
 * Componente que representa la barra de navegación de la aplicación.
 * Muestra el logotipo de la aplicación, enlaces a las páginas principales
 * y un botón para cerrar sesión.
 * @returns {JSX.Element} Componente que representa la barra de navegación de la aplicación.
 */
export default function Header() {
  const { user, logout } = useAuth();

  const logoText = "1ªRed"; 
  const letters = logoText.split("");
  const logoRef = useRef(null); 


  useEffect(() => {
    
    const letterSpans = logoRef.current.children;
    

    const anim = gsap.fromTo(
      letterSpans, // Elementos
      { 

        opacity: 0,
        y: -30 
      },
      { 
        opacity: 1,
        y: 0,
        

        duration: 1.5,
        stagger: 0.3,  
        delay: 0.5,          
        ease: 'power3.out',
      }
    );

    // Función de "limpieza" de React
    // Esto es importante para evitar problemas con React 18 (StrictMode)
    return () => {
      anim.kill();
    };

  }, []); // El array vacío [] asegura que se ejecute solo una vez


  return (
     <header className="app-header">
      <h2 className="app-logo" ref={logoRef}>
        {letters.map((letter, index) => (
          <span key={index} className="logo-letter">
            {letter}
          </span>
        ))}
      </h2>

    <nav className="app-nav">
        <Link to="/">Inicio</Link>
        <Link to="/all">Todas</Link>
        <Link to="/me">Mi perfil</Link>
    </nav>


    <div className="user-session">
      <span className="user-name">
        {user?.username ?? "Usuario"}
      </span>
      <button className="logout-button" onClick={logout}>Cerrar sesión</button>
    </div>
    </header>
  );
}