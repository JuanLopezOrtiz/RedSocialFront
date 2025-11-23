import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "../styles/CreatePublication.css";

/**
 * Datos que se envían al crear una publicación.
 * @typedef {Object} CreatePublicationValues
 * @property {string} text - Contenido de la publicación.
 */

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
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      text: "",
    },
    mode: "onBlur",
  });

  const mutation = useMutation({
/**
 * Función que crea una nueva publicación en la API.
 * Se utiliza en el hook de mutación `useMutation`.
 * @param {CreatePublicationValues} values - Valores validados del formulario.
 * @returns {Promise<any>} - Respuesta de la API (o null si 204).
 * @throws {Error} Cuando la respuesta no es ok, con el mensaje del backend si es posible.
 */
    mutationFn: async ({ text }) =>
      apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      }),
/**
 * Función que se llama cuando se crea una publicación con éxito.
 * Limpia el formulario y invalida la cache de la lista de publicaciones.
*/
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["/publications/"]);
    },
  });

  /**
   * Envía el texto de la publicación a la API.
   *
   * @param {CreatePublicationValues} values - Valores validados del formulario.
   * @returns {Promise<void>} Promesa que resuelve cuando se completa la creación.
   */
  const onSubmit = async (values) => {
    if (!user) return;
    await mutation.mutateAsync(values);
  };

  const isDisabled = useMemo(
    () => !user || isSubmitting || mutation.isPending,
    [user, isSubmitting, mutation.isPending],
  );

  return (
    <div className="create-pub-container">
      <h3 className="create-pub-title">Crea una nueva publicación</h3>
      <form
        className="create-pub-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <textarea
          placeholder={
            user
              ? "¿Qué estás pensando?" 
              : "Inicia sesión para poder publicar."
          }
          rows={4}
          className="create-pub-textarea"
          {...register("text", {
            required: user ? "La publicación no puede estar vacía." : false,
            minLength: {
              value: 3,
              message: "La publicación debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 280,
              message: "La publicación no puede superar los 280 caracteres.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.text && (
          <p className="create-pub-error">{errors.text.message}</p>
        )}

        <button
          type="submit"
          disabled={isDisabled}
          className="create-pub-button"
        >
          {isSubmitting || mutation.isPending ? "Publicando..." : "Publicar"}
        </button>
      </form>
      {mutation.isError && (
        <p className="create-pub-error">
          {mutation.error?.message ?? "Error al crear la publicación."}
        </p>
      )}
    </div>
  );
}