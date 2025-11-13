import CreatePublication from "../components/CreatePublication";
import Header from "../components/Header";
import PublicationList from "../components/PublicationList";

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
      <main style={{ padding: 20 }}>
        <CreatePublication />
        <h3>Todas las publicaciones</h3>
        <p>Aquí verás las publicaciones de todos los usuarios.</p>
        <PublicationList />
      </main>
    </>
  );
}
