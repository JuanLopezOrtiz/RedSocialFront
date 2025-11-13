// src/hooks/usePagination.js
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";


/**
 * Paginación simple: la API devuelve primero las más nuevas.
 */
export function usePagination(endpoint, pageSize = 5) {
  const [page, setPage] = useState(0);


  const { data, isLoading, isError, error } = useQuery({
    queryKey: [endpoint, page],
    // Concatenación simple y orden descendente por fecha (ajusta el campo si es distinto)
    queryFn: () =>
      apiFetch(
        endpoint +
          "?page=" + page +
          "&size=" + pageSize +
          "&sort=createDate,desc"
      ),
    keepPreviousData: true,
  });


  const items = data?.content || [];
  const totalPages = data?.totalPages || 1;


/**
 * Pasa a la siguiente página de publicaciones.
 * No hace nada si ya se está en la última página.
 */
  const nextPage = () => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  };


/**
 * Pasa a la página anterior de publicaciones.
 * No hace nada si ya se está en la primera página.
 */
  const prevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  return { items, page, totalPages, isLoading, isError, error, nextPage, prevPage };
}












