import CreatePublication from "../components/CreatePublication";
import Header from "../components/Header";
import PublicationList from "../components/PublicationList";
import "../styles/Page.css";

/**
 * Página que muestra todas las publicaciones de todos los usuarios.
 *
 * Muestra un formulario para crear una nueva publicación.
 * Muestra un título y un párrafo con una descripción de la página.
 * Muestra una lista de todas las publicaciones.
 */
export default function AllPublicationsPage() {
  return (
    <>
      <Header />
      <main className="page-container">
        <CreatePublication />
        <h3 className="page-title">Todas las publicaciones</h3>
        <p className="page-description">Aquí verás las publicaciones de todos los usuarios.</p>
        <PublicationList />
      </main>
    </>
  );
}
