import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";


/**
 * Componente que muestra una publicación y permite borrarla.
 * Solo el autor de la publicación puede borrar.
 * @param {number} id - Identificador de la publicación.
 * @param {string} authorName - Nombre de usuario del autor.
 * @param {string} text - Contenido de la publicación.
 * @param {string} createDate - Fecha de creación de la publicación.
 */
export default function GetPublication({ id, authorName, text, createDate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  // Mutación para borrar una publicación
  const deleteMutation = useMutation({
    /**
     * Función que borra una publicación por su id.
     * Se llama con el método DELETE a /publications/:id.
     * @returns {Promise<void>} Promesa que se resuelve cuando la petición ha finalizado.
     */
    mutationFn: async () => {
      await apiFetch(`/publications/${id}`, { method: "DELETE" });
    },
    
  /**
   * Función que se ejecuta cuando la mutación tiene éxito.
   * Invalida el listado de publicaciones para refrescarlo.
   */
    
    onSuccess: () => {
      // Invalida el listado de publicaciones para refrescarlo
     queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.includes("/publications"),
      });
    },
  /**
   * Función que se ejecuta cuando la mutación falla.
   * Muestra un mensaje de alerta con el mensaje de error.
   * @param {Error} error - Error que se produjo al ejecutar la mutación.
   */
    onError: (error) => {
      alert(`Error al borrar publicación: ${error.message}`);
    },
  });


  // Handler para el click
  const handleDelete = () => {
    if (window.confirm("¿Seguro que quieres borrar esta publicación?")) {
      deleteMutation.mutate();
    }
  };


  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "10px",
        backgroundColor: "#fafafa",
      }}
    >
      <p>
        <strong
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate(`/profile/${authorName}`)}
        >
          {authorName}
        </strong>{" "}
        — {new Date(createDate).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
      </p>


      <p>{text}</p>


      {/* Solo el autor puede borrar */}
      {user?.username === authorName && (
        <button
          style={{
            color: "white",
            backgroundColor: "#dc3545",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Borrando..." : "Borrar publicación"}
        </button>
      )}
    </div>
  );
}
