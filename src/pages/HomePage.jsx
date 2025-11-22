import CreatePublication from "../components/CreatePublication";
import Header from "../components/Header";
import PublicationFollowing from "../components/PublicationFollowing";
import "../styles/Page.css";


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
      <main className="page-container">
        <h3 className="page-title">Publicaciones de tus seguidos</h3>
        <PublicationFollowing />
      </main>
    </>
  );
}



