import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";




/**
 * Muestra el perfil de un usuario en particular.
 * Utiliza useParams para obtener el nombre de la URL.
 * Utiliza useState para guardar el perfil del usuario, la carga y el error.
 * Utiliza useEffect para cargar el perfil del usuario con un GET a /users/public/{name}.
 * Si hay un error, se muestra un mensaje de error.
 * Si no hay perfil, se muestra un mensaje.
 * Muestra el perfil en un div con estilos de CSS.
 * @returns {JSX.Element} Perfil del usuario.
 */
export default function UserProfile() {
  const { name } = useParams(); // toma el nombre de la URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
  /**
   * Carga el perfil del usuario con el nombre dado.
   * Intenta obtener el perfil del usuario con un GET a /users/public/{name}.
   * Si hay un error, lo guarda en el estado de error.
   * Si no hay error, guarda el perfil en el estado de perfil.
   * Finalmente, siempre cambia el estado de carga a false.
   */
    async function loadProfile() {
      try {
        const data = await apiFetch(`/users/public/${name}`);
        setProfile(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [name]);




  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;
  if (!profile) return <p>No se encontró el perfil del usuario.</p>;




  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>{profile.username}</h2>
      <p>{profile.email}</p>
      <p>{profile.description || "Sin descripción disponible"}</p>
    </div>
  );
}