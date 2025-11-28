import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import "../styles/AuthForm.css";

/**
 * Datos que se envían en el formulario de login.
 * @typedef {Object} LoginFormValues
 * @property {string} username - Nombre de usuario.
 * @property {string} password - Contraseña del usuario.
 */
export default function LoginForm() {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    /**
     * Llamado cuando la mutación tiene éxito.
     * Recibe los datos de la respuesta de la API.
     * @param {Object} data - Datos de la respuesta de la API.
     */
    onSuccess: (data) => {
      // Suponemos que la API devuelve { access_token, username }
      login(data.access_token, { username: data.username });
    },
  });

  /**
   * Envía el formulario a la API.
   *
   * @param {LoginFormValues} values - Valores validados del formulario.
   * @returns {Promise<void>} Promesa que resuelve cuando termina el login.
   */
  const onSubmit = async (values) => {
    await mutation.mutateAsync(values);
  };

  const isDisabled = useMemo(
    () => isSubmitting || mutation.isPending,
    [isSubmitting, mutation.isPending],
  );

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3 className="auth-title">Iniciar sesión</h3>

        <label htmlFor="username" style={{ display: "none" }}>Nombre de usuario</label>
        <input
          id="username"
          type="text"
          placeholder="Nombre de usuario"
          className="auth-input"
          autoComplete="username"
          {...register("username", {
            required: "El nombre de usuario es obligatorio.",
            minLength: {
              value: 3,
              message: "El nombre de usuario debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 30,
              message: "El nombre de usuario no puede superar los 30 caracteres.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.username && (
          <p className="auth-error">{errors.username.message}</p>
        )}

        <label htmlFor="password" style={{ display: "none" }}>Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Contraseña"
          className="auth-input"
          autoComplete="current-password"
          {...register("password", {
            required: "La contraseña es obligatoria.",
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.password && (
          <p className="auth-error">{errors.password.message}</p>
        )}

        <button type="submit" className="auth-button" disabled={isDisabled}>
          {isDisabled ? "Entrando..." : "Entrar"}
        </button>

        {mutation.isError && (
          <p className="auth-error">
            {mutation.error?.message ?? "No se ha podido iniciar sesión."}
          </p>
        )}
      </form>

      <p className="auth-switch">
        ¿No tienes cuenta? <Link to="/register"> Regístrate </Link>
      </p>
    </div>
  );
}