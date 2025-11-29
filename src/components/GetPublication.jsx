import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/client";
import "../styles/GetPublication.css";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

/**
 * Componente para mostrar una publicación.
 *
 * Muestra la publicación con su autor, fecha de creación y texto.
 * Permite borrar la publicación si el usuario autenticado es el mismo que el autor de la publicación.
 * Permite redirigir al perfil del autor de la publicación.
 *
 * @param {Object} props - Valores de la publicación.
 * @param {string} props.id - ID de la publicación.
 * @param {string} props.authorName - Nombre del autor de la publicación.
 * @param {string} props.text - Texto de la publicación.
 * @param {string} props.createDate - Fecha de creación de la publicación.
 * @param {Array} props.queryKey - La queryKey de React Query que esta publicación debe invalidar.
 * @returns {JSX.Element} Componente que muestra la publicación.
 */
export default function GetPublication({ id, authorName, text, createDate, queryKey }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const pubRef = useRef(null);

  const deleteMutation = useMutation({
    /**
     * Función que borra una publicación por su ID.
     * Se utiliza en el hook de mutación `useMutation`.
     * @returns {Promise<void>} Promesa que se resuelve cuando se borra la publicación.
     */
    mutationFn: async () => {
      await apiFetch(`/publications/${id}`, { method: "DELETE" });
    },
    /**
     * Función que se llama cuando se borra una publicación con éxito.
     * Anima la salida y actualiza manualmente la caché de la lista de publicaciones.
     */
    onSuccess: () => {
      gsap.to(pubRef.current, {
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        duration: 0.4,
        ease: 'power2.in',
/**
 * Función que se llama cuando se completa la animación de borrado de la publicación.
 * Anima la salida y actualiza manualmente la caché de la lista de publicaciones.
 * Se llama después de que la animación de borrado ha terminado.
 * Invalida la caché de la lista de publicaciones y devuelve una nuevo estado.
 */
        onComplete: () => {
          queryClient.setQueryData(queryKey, (oldData) => {
            if (!oldData) {
              return { pages: [], pageParams: [] };
            }

            const newPages = oldData.pages.map(page => {
              const newContent = page.content.filter(pub => pub.id !== id);
              return {
                ...page,
                content: newContent,
              };
            });

            return {
              ...oldData,
              pages: newPages,
            };
          });
        }
      });
    },
    /**
     * Función que se llama cuando ocurre un error al borrar una publicación.
     * Muestra un mensaje de alerta con el mensaje de error.
     * @param {Error} error - Error que se produjo al borrar la publicación.
     */
    onError: (error) => {
      alert(`Error al borrar publicación: ${error.message}`);
    },
  });

  /**
   * Borra una publicación por su ID.
   * Pide una confirmación al usuario antes de borrar la publicación.
   * Si el usuario confirma, llama a la mutación para borrar la publicación.
   */
  const handleDelete = () => {
    if (window.confirm("¿Seguro que quieres borrar esta publicación?")) {
      deleteMutation.mutate();
    }
  };

  /**
   * Función que se llama cuando se hace clic en el nombre del autor de una publicación.
   * Si el usuario autenticado es el mismo que el autor de la publicación, redirige a la página de perfil.
   * Si no es el mismo, redirige a la página de perfil del autor de la publicación.
   */
  const handleAuthorClick = () => {
    if (user?.username === authorName) {
      navigate("/me");
    } else {
      navigate(`/profile/${authorName}`);
    }
  };

  // Animación
  useEffect(() => {
    const el = pubRef.current;

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true,
      }
    });

    return () => {
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div className="publication-container" ref={pubRef}>
      <p className="publication-header">
        <strong
          className="publication-author"
          onClick={handleAuthorClick}
        >
          {authorName}
        </strong>
        <span className="publication-date">
          {" "}— {new Date(createDate).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
        </span>
      </p>

      <p className="publication-text">{text}</p>

      {user?.username === authorName && (
        <button
          className="publication-delete-btn"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Borrando..." : "Borrar publicación"}
        </button>
      )}
    </div>
  );
}