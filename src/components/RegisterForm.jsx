import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthForm.css"; 


/**
 * Datos que se envían en el formulario de registro.
 * @typedef {Object} RegisterFormValues
 * @property {string} username - Nombre de usuario.
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} password - Contraseña del usuario.
 */

/**
 * Componente para registrar un nuevo usuario.
 * Renderiza un formulario para registrar un nuevo usuario.
 * El registro se hace con un POST a /auth/register.
 * @returns {JSX.Element} Formulario para registrar un nuevo usuario.
 */
export default function RegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  // Mutación para registrar un nuevo usuario
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      reset();
      // Damos un breve tiempo para que el usuario vea el mensaje de éxito
      setTimeout(() => navigate("/"), 1000);
    },
  });

  /**
   * Función para manejar el envío del formulario de registro.
   * Previene el envío del formulario y llama a la mutación para registrar un nuevo usuario.
   * @param {RegisterFormValues} values - Valores validados del formulario.
   * @returns {Promise<void>}
   */
  const onSubmit = async (values) => {
    await mutation.mutateAsync(values);
  };

  const isDisabled = useMemo(
    () => isSubmitting || mutation.isPending,
    [isSubmitting, mutation.isPending],
  );

  return (
    <main className="auth-container">
      <h2 className="auth-welcome">Bienvenida a MiniRed</h2>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3 className="auth-title">Registro</h3>

        <label htmlFor="username" style={{ display: "none" }}>Usuario</label>
        <input
          id="username"
          type="text"
          placeholder="Usuario"
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

        <label htmlFor="email" style={{ display: "none" }}>Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="auth-input"
          autoComplete="email"
          {...register("email", {
            required: "El correo electrónico es obligatorio.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u,
              message: "Introduce un correo electrónico válido.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.email && (
          <p className="auth-error">{errors.email.message}</p>
        )}

        <label htmlFor="password" style={{ display: "none" }}>Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Contraseña"
          className="auth-input"
          autoComplete="new-password"
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
          {isDisabled ? "Registrando..." : "Registrarse"}
        </button>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/"> Logeate </Link>
        </p>

        {mutation.isError && (
          <p className="auth-error">
            {mutation.error?.message ?? "No se ha podido completar el registro."}
          </p>
        )}
        {mutation.isSuccess && (
          <p className="auth-success">Registro completado con éxito</p>
        )}
      </form>
    </main>
  );
}