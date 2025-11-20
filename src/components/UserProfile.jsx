import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import "../styles/UserProfile.css";
import UserListModal from "./UserListModal"; 

/**
 * Muestra el perfil de un usuario en particular.
 * (MODIFICADO) Ahora muestra listas de seguidores/seguidos al hacer clic.
 * @returns {JSX.Element} Perfil del usuario.
 */
export default function UserProfile() {
  const { name } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);


  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [listToShow, setListToShow] = useState(null);


  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const profilePromise = apiFetch(`/users/public/${name}`);
        const followersPromise = apiFetch(`/users/public/followers/${name}`);
        const followingPromise = apiFetch(`/users/public/following/${name}`);

        const [profileData, followersData, followingData] = await Promise.all([
          profilePromise,
          followersPromise,
          followingPromise,
        ]);

        setProfile(profileData);
        

        // Guarda las listas completas en el estado
        setFollowersList(followersData);
        setFollowingList(followingData);
        // Actualiza los contadores
        setFollowersCount(followersData.length);
        setFollowingCount(followingData.length);


      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [name]);

  if (loading) return <p className="loading-text">Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p>No se encontró el perfil del usuario.</p>;

  // Determina qué lista y título pasar al modal
  const listData = listToShow === 'followers' ? followersList : followingList;
  const listTitle = listToShow === 'followers' ? 'Seguidores' : 'Siguiendo';

  return (
    <> {/* Fragmento para permitir el modal junto al perfil */}
      <div className="profile-container">
        <h2 className="profile-username">{profile.username}</h2>
        <p className="profile-email">{profile.email}</p>
        <p className="profile-description">{profile.description || "Sin descripción disponible"}</p>

        
        <div className="profile-stats-container">
          <div 
            className="profile-stat profile-stat-clickable" // Nueva clase
            onClick={() => setListToShow('followers')} // Acción
            role="button"
            tabIndex="0"
          >
            <strong className="profile-stat-count">{followersCount}</strong>
            <span className="profile-stat-label">Seguidores</span>
          </div>
          <div 
            className="profile-stat profile-stat-clickable" // Nueva clase
            onClick={() => setListToShow('following')} // Acción
            role="button"
            tabIndex="0"
          >
            <strong className="profile-stat-count">{followingCount}</strong>
            <span className="profile-stat-label">Siguiendo</span>
          </div>
        </div>
      </div>

      
      {/* Si listToShow no es null, muestra el modal */}
      {listToShow && (
        <UserListModal 
          title={listTitle}
          users={listData}
          onClose={() => setListToShow(null)} // Función para cerrar
        />
      )}
    </>
  );
}