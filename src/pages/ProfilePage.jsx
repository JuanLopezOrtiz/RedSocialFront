import { useParams } from "react-router-dom";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";
import ProfilePublications from "../components/ProfilePublications";
import "../styles/Page.css";

/**
 * Página que muestra el perfil y las publicaciones de un usuario en particular.
 * Recibe el nombre del usuario como parámetro en la URL.
 * Muestra un título y un párrafo con una descripción de la página.
 * Muestra el Perfil del usuario.
 * Muestra una lista de todas las publicaciones del usuario.
 * @param {string} name - nombre del usuario en la URL.
 * @returns {JSX.Element} Página que muestra el Perfil y las publicaciones del usuario.
 */
export default function ProfilePage() {
  const { name } = useParams();
  return (
    <>
      <Header />
      <main className="page-container">
        <h3 className="page-title">Perfil de {name}</h3>
        <UserProfile />
        <ProfilePublications />
      </main>
    </>
  );
}