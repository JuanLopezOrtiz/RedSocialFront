import { usePagination } from "../hooks/usePagination";
import GetPublication from "./GetPublication";


/**
 * Muestra las publicaciones de los usuarios que se siguen.
 *
 * Utiliza usePagination para obtener las publicaciones de los usuarios que se siguen.
 * Muestra un mensaje de carga mientras se cargan las publicaciones.
 * Si hay un error, se muestra un mensaje de error.
 * Si no hay publicaciones, se muestra un mensaje.
 * Muestra las publicaciones en una lista.
 * Permite cambiar de página.
 */
export default function PublicationFollowing() {
  const { items, page, totalPages, isLoading, isError, error, nextPage, prevPage } =
    usePagination("/publications/following", 5); // endpoint y tamaño de página


  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;


  return (
    <div style={{ padding: "20px" }}>
      <h2>Publicaciones (página {page + 1} de {totalPages})</h2>


      {items.length === 0 && <p>No hay publicaciones disponibles.</p>}


      {items.map((pub) => (
        <GetPublication
          key={pub.id}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
      ))}


      <div style={{ marginTop: "20px" }}>
        <button onClick={prevPage} disabled={page === 0}>
          ← Anterior
        </button>
        <button onClick={nextPage} disabled={page >= totalPages - 1} style={{ marginLeft: "10px" }}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}