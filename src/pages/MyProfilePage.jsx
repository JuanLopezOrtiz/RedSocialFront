import Header from "../components/Header";
import MyPublications from "../components/MyPublications";
import MyUserProfile from "../components/MyUserProfile";

/**
 * Página que muestra el perfil personal y las publicaciones del usuario autenticado.
 * Muestra un título y un párrafo con una descripción de la página.
 * Muestra el perfil del usuario autenticado.
 * Muestra una lista de todas las publicaciones del usuario autenticado.
 */
export default function MyProfilePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Mi perfil</h3>
        <MyUserProfile />
        <MyPublications />
      </main>
    </>
  );
}