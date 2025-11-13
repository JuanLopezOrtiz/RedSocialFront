import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

/**
 * Componente para registrar un nuevo usuario.
 * Renderiza un formulario para registrar un nuevo usuario.
 * El registro se hace con un POST a /auth/register.
 * La lista de publicaciones se recarga automáticamente después de registrar un nuevo usuario.
 * @returns {JSX.Element} Formulario para registrar un nuevo usuario.
 */
export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });


  const navigate = useNavigate();
  // Mutación para registrar un nuevo usuario
  const mutation = useMutation({
    mutationFn: registerUser,


    onSuccess: () => {
      setTimeout(()=> navigate("/"), 1000);
    }
  });


/**
 * Función para manejar el envío del formulario de registro.
 * Previene el envío del formulario y llama a la mutación para registrar un nuevo usuario.
 * @param {Event} e - Evento de envío del formulario de registro.
 */
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };


  return (
    <main className="auth-container">
      <h2 className="auth-welcome">Bienvenida a MiniRed</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
      <h3 className="auth-title">Registro</h3>


      <input
        type="text"
        placeholder="Usuario"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="auth-input"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="auth-input"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="auth-input"
        required
      />
      <button type="submit" className="auth-button" disabled={mutation.isPending}>
        Registrarse
      </button>

      <p className="auth-switch">¿Ya tienes cuenta? <Link to="/"> Logeate </Link></p>



      {mutation.isError && (
        <p className="auth-error">{mutation.error.message}</p>
      )}
      {mutation.isSuccess && (
        <p className="auth-success">Registro completado con éxito</p>
      )}
    </form>
    </main>
  );
}
