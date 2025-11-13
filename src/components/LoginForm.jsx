// src/components/LoginForm.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";






/**
 * Formulario para iniciar sesión.
 * Renderiza un formulario para iniciar sesión.
 * La autenticación se hace con un POST a /auth/login.
 * La lista de publicaciones se recarga automáticamente después de iniciar sesión.
 * @returns {JSX.Element} Formulario para iniciar sesión.
 */
export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });


 


 


  const mutation = useMutation({
    mutationFn: loginUser,
/**
 * Llamado cuando la mutación tienexito.
 * Recibe los datos de la respuesta de la API.
 * @param {Object} data - Datos de la respuesta de la API.
 */
    onSuccess: (data) => {
      // Suponemos que la API devuelve { token, user }
      login(data.access_token, { username: data.username });
    },
  });




/**
 * Función para manejar el envío del formulario de inicio de sesión.
 * Previene el envío del formulario y llama a la mutación para iniciar sesión.
 * @param {Event} e - Evento de envío del formulario.
 */
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };




  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Iniciar sesión</h3>




        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" disabled={mutation.isPending}>
          Entrar
        </button>




        {mutation.isError && (
          <p style={{ color: "red" }}>{mutation.error.message}</p>
        )}
      </form>


      <p>¿No tienes cuenta? <Link to="/register"> Registrate </Link></p>
    </>
  );
}


