import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { apiFetch } from "../api/client"; 
import GetPublication from "./GetPublication";
import "../styles/PaginatedList.css";


/**
 * Muestra una lista de publicaciones.
 *
 * Utiliza useInfiniteQuery para cargar las publicaciones de forma
 * infinita. Muestra un mensaje de carga mientras se cargan las
 * publicaciones. Si hay un error, se muestra un mensaje de error.
 * Si no hay publicaciones, se muestra un mensaje.
 * Muestra las publicaciones en una lista.
 * Permite cambiar de página.
 */
export default function PublicationList() {
  

  const endpoint = "/publications/";
  const pageSize = 5;

  /**
   * Función que realmente busca los datos.
   * pageParam es gestionado automáticamente por useInfiniteQuery.
   */
  const fetchPublications = async ({ pageParam = 0 }) => {
    const url = `${endpoint}?page=${pageParam}&size=${pageSize}&sort=createDate,desc`;
    const data = await apiFetch(url);
    return data; 
  };

  const {
    data, 
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage, 
  } = useInfiniteQuery({
    queryKey: ['publications', endpoint],
    queryFn: fetchPublications, 
    initialPageParam: 0, 

    /**
     * Esta función le dice a React Query cómo encontrar el
     * número de la *siguiente* página.
     */
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.totalPages;
      const nextPage = allPages.length;

      return nextPage < totalPages ? nextPage : undefined;
    },
  });


  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 } 
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]); 



  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p className="error-text">Error: {error.message}</p>;

  const allPublications = data.pages.flatMap(page => page.content);

  return (
    <div className="paginated-list-container">
      <h2 className="paginated-list-title">Publicaciones</h2>

      {allPublications.length === 0 && <p className="paginated-list-empty">No hay publicaciones disponibles.</p>}

      {allPublications.map((pub) => (
          <GetPublication
            key={pub.id}
            id={pub.id}
            authorName={pub.username}
            text={pub.text}
            createDate={pub.createDate}
          />
        )
      )}

      <div ref={loadMoreRef} className="infinite-scroll-trigger">
        {isFetchingNextPage && <p className="loading-text">Cargando más...</p>}
        {!hasNextPage && allPublications.length > 0 && (
          <p className="paginated-list-empty">No hay más publicaciones.</p>
        )}
      </div>
    </div>
  );
}