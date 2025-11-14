// src/components/MyUserProfile.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/useAuth";
import "../styles/UserProfile.css";

/**
 * Componente para mostrar el perfil del usuario autenticado.
 * Renderiza un formulario para actualizar el nombre de usuario.
 * La actualización se hace con un PATCH a /users/change.
 * La lista de publicaciones se recarga automáticamente después de actualizar el nombre de usuario.
 * @returns {JSX.Element} Formulario para actualizar el nombre de usuario.
 */
export default function MyUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Estado para mostrar/ocultar formulario
  const [showForm, setShowForm] = useState(false);


  // Estado para el nuevo nombre de usuario
  const [newUsername, setNewUsername] = useState("");
  // Estado para el mensaje de redireccionamiento
  const [isUpdating, setIsUpdating] = useState(false);
  // Estado para el error de actualización
  const [updateError, setUpdateError] = useState(null);
  // Estado para el mensaje de redireccionamiento
  const [redirectMessage, setRedirectMessage] = useState("");


  useEffect(() => {
/**
 * Carga el perfil del usuario autenticado.
 * Si no hay un usuario autenticado, no hace nada.
 * Intenta obtener el perfil del usuario con un GET a /users/public/{username}.
 * Si hay un error, lo guarda en el estado de error.
 * Si no hay error, guarda el perfil en el estado de perfil.
 * Finalmente, siempre cambia el estado de carga a false.
 */
    async function loadProfile() {
      if (!user?.username) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch(`/users/public/${user.username}`);
        setProfile(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user.username]);


/**
 * Actualiza el nombre de usuario del usuario autenticado.
 * Llama a que el nuevo nombre de usuario no esté vacío y sea diferente al actual.
 * Intenta actualizar el nombre de usuario con un PATCH a /users/change.
 * Si hay un error, lo muestra en el estado de error.
 * Si no hay error, cambia el estado de redireccionamiento a true y
 * redirige al login después de 2 segundos.
 * @param {Event} e - Evento de envío del formulario de cambio de nombre de usuario.
 */
  const handleChangeUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setUpdateError("El nombre de usuario no puede estar vacío.");
      return;
    }
    if (newUsername === user.username) {
      setUpdateError("El nuevo nombre de usuario debe ser diferente al actual.");
      return;
    }

    // Actualizar el nombre de usuario
    setIsUpdating(true);
    // Limpiar el mensaje de redireccionamiento
    setUpdateError(null);


    try {
      await apiFetch("/users/change", {
        method: "PATCH",
        body: JSON.stringify({ username: newUsername }),
      });


      setRedirectMessage("Nombre de usuario actualizado. Serás redirigido al login...");


      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.replace("/login");
      }, 2000);


    } catch (err) {
      setUpdateError(err.message || "Error al actualizar el nombre de usuario.");
      setIsUpdating(false);
    }
  };


  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p>No se encontró el perfil del usuario.</p>;


  return (
    <div className="profile-container">
      <h2 className="profile-username">{profile.username}</h2>
      <p className="profile-email">{profile.email}</p>
      <p className="profile-description">{profile.description || "Sin descripción disponible"}</p>


      <hr className="profile-divider" />


      {/*Botón para mostrar/ocultar formulario */}
      <button onClick={() => setShowForm(!showForm)} className="profile-toggle-form-btn">
        {showForm ? "Cancelar" : "Cambiar nombre de usuario"}
      </button>


      {/*El formulario solo aparece si showForm es true */}
      {showForm && (
        <form onSubmit={handleChangeUsername} className="profile-update-form">
          <h3 className="profile-update-title">Cambiar nombre de usuario</h3>


          <div className="form-group">
            <label htmlFor="newUsername"className="form-label">
              Nuevo nombre de usuario:
            </label>
            <input
              id="newUsername"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Introduce tu nuevo username"
              className="form-input"
              disabled={isUpdating}
            />
          </div>


          <button
            type="submit"
            disabled={isUpdating}
            className="profile-update-submit-btn"
          >
            {isUpdating ? "Actualizando..." : "Actualizar nombre"}
          </button>


          {updateError && (
            <p className="error-text">{updateError}</p>
          )}


          {redirectMessage && (
            <p className="success-text">
              {redirectMessage}
            </p>
          )}
        </form>
      )}
    </div>
  );
}