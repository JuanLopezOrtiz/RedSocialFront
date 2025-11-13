import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";
import { useQueryClient } from "@tanstack/react-query";


/**
 * Componente para crear una nueva publicación.
 *
 * Renderiza un formulario para crear una publicación.
 * La publicación se crea con un POST a /publications.
 * La lista de publicaciones se recarga automáticamente después de crear una.
 *
 * @returns {JSX.Element} Formulario para crear una publicación.
 */

export default function CreatePublication() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);


  const queryClient = useQueryClient();


  if (!user) {
    return <p>Debes estar logueado para crear una publicación.</p>;
  }


/**
 * Función para manejar el envío del formulario de crear una publicación.
 *
 * Previene el envío del formulario y si el texto no está vacío,
 * crea una publicación con un POST a /publications.
 * Si hay un error, se muestra un mensaje de error.
 * Si no hay error, se borra el texto del formulario y se invalida
 * la cache de la lista de publicaciones.
 */
  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!text.trim()) {
      setError("La publicación no puede estar vacía.");
      return;
    }


    setIsSubmitting(true);
    setError(null);


    try {
      await apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      });


      setText("");


      // Recarga automática de la lista
      queryClient.invalidateQueries(["/publications/"]);


    } catch (err) {
      setError(err.message || "Error al crear la publicación.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div style={{
      maxWidth: "600px",
      margin: "20px auto",
      padding: "15px",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    }}>
      <h3>Crea una nueva publicación</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Qué estás pensando?"
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "none",
          }}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginTop: "10px",
            padding: "10px 15px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}




