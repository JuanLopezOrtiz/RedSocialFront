import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";
import "../styles/GetPublication.css";


import { useRef, useEffect } from "react";
import { gsap } from "gsap";


/**
 * Componente que muestra una publicación y permite borrarla.
 * (MODIFICADO) Ahora usa gsap.to y limpia la animación.
 */
export default function GetPublication({ id, authorName, text, createDate }) {
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
 * Invalida la cache de la lista de publicaciones.
 */
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.includes("/publications"),
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
