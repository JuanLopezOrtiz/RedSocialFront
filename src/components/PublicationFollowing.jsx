import GetPublication from "./GetPublication";
import "../styles/PaginatedList.css";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { apiFetch } from "../api/client";

/**
 * Muestra las publicaciones de los usuarios que se siguen con scroll infinito.
 *
 * Utiliza useInfiniteQuery para obtener las publicaciones.
 * Carga más publicaciones automáticamente al llegar al final de la lista.
 */
export default function PublicationFollowing() {

  const endpoint = "/publications/following";
  const pageSize = 5;

/**
 * Función que realmente busca las publicaciones.
 * pageParam es gestionado automáticamente por useInfiniteQuery.
 * Devuelve la respuesta completa de la API.
 * @param {{ pageParam: number }} - Parámetro de página.
 * @returns {Promise<any>} - Respuesta de la API.
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
    queryKey: ['publications', 'following'],
    queryFn: fetchPublications,
    initialPageParam: 0,
  /**
   * Función que determina la siguiente página a cargar.
   * Devuelve undefined si ya se han cargado todas las páginas.
   * @param {Object} lastPage - Última respuesta de la API.
   * @param {Array} allPages - Todas las respuestas anteriores.
   * @returns {number|undefined} - Número de la siguiente página o undefined si no hay más.
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

      <h2 className="paginated-list-title">Publicaciones de usuarios que sigues</h2>

      {allPublications.length === 0 && <p className="paginated-list-empty">No hay publicaciones disponibles.</p>}


      {allPublications.map((pub) => (
        <GetPublication
          key={pub.id}
          id={pub.id}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
      ))}

      <div ref={loadMoreRef} className="infinite-scroll-trigger">
        {isFetchingNextPage && <p className="loading-text">Cargando más...</p>}
        {!hasNextPage && allPublications.length > 0 && (
          <p className="paginated-list-empty">No hay más publicaciones.</p>
        )}
      </div>
    </div>
  );
}
