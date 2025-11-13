import CreatePublication from "../components/CreatePublication";
import Header from "../components/Header";
import PublicationFollowing from "../components/PublicationFollowing";


/**
 * Página principal de la aplicación.
 * Muestra la barra de navegación superior, un formulario para crear una publicación,
 * y una lista de publicaciones de los usuarios que se siguen.
 * @returns {JSX.Element} Página principal de la aplicación.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Publicaciones de tus seguidos</h3>
        <CreatePublication />
        <PublicationFollowing />
      </main>
    </>
  );
}



