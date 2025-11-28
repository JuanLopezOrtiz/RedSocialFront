import React from "react";
import { Link } from "react-router-dom";
import "../styles/UserListModal.css";
import { useAuth } from "../hooks/useAuth";

/**
 * Un componente modal reutilizable para mostrar una lista de usuarios.
 * @param {object} props
 * @param {string} props.title - Título del modal (ej: "Seguidores")
 * @param {Array} props.users - Array de objetos de usuario (deben tener .username)
 * @param {Function} props.onClose - Función para cerrar el modal
 */
export default function UserListModal({ title, users, onClose }) {
  const { user: loggedInUser } = useAuth(); // Obtienes al usuario logueado

  // Evita que el clic dentro del modal lo cierre
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times; {/* Este es el símbolo 'x' */}
          </button>
        </div>

        <div className="modal-body">
          {users.length > 0 ? (
            <ul className="user-list">
              {users.map((user) => {
                // Comprueba si el usuario de la lista es el mismo que el logueado
                const isMe = user.username === loggedInUser?.username;

                // Cambia el enlace de perfil a /me si el usuario es el logueado
                const profileLink = isMe ? "/me" : `/profile/${user.username}`;

                return (
                  <li key={user.username} className="user-list-item">
                    <Link to={profileLink} onClick={onClose}>
                      {user.username}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No hay usuarios para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
}