import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import "../styles/UserProfile.css";
import UserListModal from "./UserListModal"; 
import { useAuth } from "../context/useAuth";



/**
 * Muestra el perfil de un usuario.
 * 
 * @param {Object} user - El usuario logueado.
 * @param {string} name - El nombre del usuario cuyo perfil se va a mostrar.
 * @returns {JSX.Element} El perfil del usuario.
 */
export default function UserProfile() {

  const { user: loggedInUser } = useAuth();
  const { name } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  

  const [isFollowing, setIsFollowing] = useState(false);

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [listToShow, setListToShow] = useState(null);


  useEffect(() => {
/**
 * Carga el perfil del usuario con nombre 'name', sus seguidores y los usuarios a los que sigue.
 * Actualiza los estados de carga, error y lista de seguidores/seguidos.
 * Comprueba si el usuario logueado está en la lista de seguidores y actualiza el estado de 'isFollowing'.
 */
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        setIsFollowing(false); // Reseteamos por si cambia el 'name'

        const profilePromise = apiFetch(`/users/public/${name}`);
        const followersPromise = apiFetch(`/users/public/followers/${name}`);
        const followingPromise = apiFetch(`/users/public/following/${name}`);

        const [profileData, followersData, followingData] = await Promise.all([
          profilePromise,
          followersPromise,
          followingPromise,
        ]);

        setProfile(profileData);
        
        setFollowersList(followersData);
        setFollowingList(followingData);
        setFollowersCount(followersData.length);
        setFollowingCount(followingData.length);

        // Comprueba si el usuario logueado está en la lista de seguidores
        if (loggedInUser) {
          setIsFollowing(followersData.some(u => u.username === loggedInUser.username));
        }

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();

  // Añadimos loggedInUser para que el efecto se re-ejecute si el usuario inicia/cierra sesión
  }, [name, loggedInUser]); 

  if (loading) return <p className="loading-text">Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p>No se encontró el perfil del usuario.</p>;

  const listData = listToShow === 'followers' ? followersList : followingList;
  const listTitle = listToShow === 'followers' ? 'Seguidores' : 'Siguiendo';


/**
 * Función para seguir a un usuario.
 * Actualiza el estado de loading y error.
 * Actualiza el estado de isFollowing y followersCount.
 * Actualiza la lista de seguidores del modal de forma optimista.
 * @throws {Error} Si hay un error al seguir al usuario.
 */
  async function handleFollow() {
    try {
      await apiFetch(`/users/follow/${name}`, { method: "POST" });
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
      // Actualiza la lista del modal de forma optimista
      if (loggedInUser) {
        setFollowersList(prevList => [...prevList, { username: loggedInUser.username }]);
      }
    } catch (err) {
      console.error("Error al seguir:", err);
    }
  }

/**
 * Deja de seguir a un usuario.
 * Actualiza el estado de loading y error.
 * Actualiza el estado de isFollowing y followersCount.
 * Actualiza la lista de seguidores del modal de forma optimista.
 * @throws {Error} Si hay un error al dejar de seguir al usuario.
 */
  async function handleUnfollow() {
    try {
      await apiFetch(`/users/unfollow/${name}`, { method: "DELETE" });
      setIsFollowing(false);
      setFollowersCount(prev => (prev > 0 ? prev - 1 : 0));
      // Actualiza la lista del modal de forma optimista
      if (loggedInUser) {
        setFollowersList(prevList => 
          prevList.filter(u => u.username !== loggedInUser.username)
        );
      }
    } catch (err) {
      console.error("Error al dejar de seguir:", err);
    }
  }


  return (
    <> 
      <div className="profile-container">
        <h2 className="profile-username">{profile.username}</h2>
        <p className="profile-email">{profile.email}</p>
        <p className="profile-description">{profile.description || "Sin descripción disponible"}</p>


        {loggedInUser && loggedInUser.username !== name && (
          <button
            className={isFollowing ? "follow-btn unfollow" : "follow-btn"}
            onClick={isFollowing ? handleUnfollow : handleFollow}
          >
            {isFollowing ? "Dejar de seguir" : "Seguir"}
          </button>
        )}

        
        <div className="profile-stats-container">
          <div 
            className="profile-stat profile-stat-clickable"
            onClick={() => setListToShow('followers')}
            role="button"
            tabIndex="0"
          >
            <strong className="profile-stat-count">{followersCount}</strong>
            <span className="profile-stat-label">Seguidores</span>
          </div>
          <div 
            className="profile-stat profile-stat-clickable"
            onClick={() => setListToShow('following')}
            role="button"
            tabIndex="0"
          >
            <strong className="profile-stat-count">{followingCount}</strong>
            <span className="profile-stat-label">Siguiendo</span>
          </div>
        </div>
      </div>

      
      {listToShow && (
        <UserListModal 
          title={listTitle}
          users={listData}
          onClose={() => setListToShow(null)}
        />
      )}
    </>
  );
}