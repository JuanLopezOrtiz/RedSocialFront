# MiniRed — MicroRed Social (DAW) — Juan López Ortiz

MicroRed es un frontend prototipo para una pequeña red social creado para el ciclo de Desarrollo de Aplicaciones Web (DAW). Este documento README sigue la estructura requerida: título (con DAW y nombre del alumno), índice con enlaces, introducción, funcionalidades, instalación, uso, conclusión, contribuciones, licencias y contacto.

---

## Índice

1. [Introducción](#introducción)
2. [Funcionalidades y tecnologías](#funcionalidades-y-tecnologías)
3. [Guía de instalación](#guía-de-instalación)
4. [Guía de uso](#guía-de-uso)
5. [Conclusión](#conclusión)
6. [Contribuciones, agradecimientos y referencias](#contribuciones-agradecimientos-y-referencias)
7. [Licencia](#licencia)
8. [Contacto](#contacto)

---

## Introducción

Descripción del proyecto:

MiniRed es una aplicación frontend de ejemplo que permite a los usuarios registrarse, iniciar sesión, crear publicaciones y ver las publicaciones propias o de otros usuarios. Está desarrollada con React y es consumidora de una API REST (esperada en `http://localhost:8080/api/v1`).

Justificación:

El proyecto sirve como ejercicio práctico para afianzar técnicas de desarrollo frontend modernas (hooks, consumo de APIs, manejo de tokens JWT, paginación y scroll infinito, cache con React Query) en el ciclo DAW.

Objetivos:

- Implementar autenticación con storage de token.
- Mostrar listas paginadas de publicaciones (y scroll infinito en perfiles).
- Crear un cliente HTTP reutilizable con manejo de errores robusto.

Motivación:

Aprender a desarrollar una SPA con prácticas de gestión de estado remoto, arquitectura con hooks reutilizables y buena separación de responsabilidades entre componentes y servicios de API.

---

## Funcionalidades y tecnologías utilizadas

Funcionalidades principales:

- Registro y login (autenticación JWT).
- Almacenamiento del token en localStorage con envío automático de Authorization header.
- Crear publicaciones (formulario).
- Listado de publicaciones generales y por perfil.
- Paginación y scroll infinito en la vista de publicaciones de perfil.

Tecnologías utilizadas:

- React 19 + Vite
- @tanstack/react-query
- react-router-dom
- react-hook-form
- GSAP (animaciones)
- ESLint

---

## Guía de instalación

Requisitos:

- Node.js (v16 o superior recomendado)

Instalación y ejecución local:

```powershell
# clona el repositorio
git clone https://github.com/JuanLopezOrtiz/RedSocialFront
cd RedSocialFront

# instala dependencias
npm install

# arranca en modo desarrollo
npm run dev

# construye para producción
npm run build

# preview del build (opcional)

```

Nota: el cliente HTTP usa por defecto la base URL `http://localhost:8080/api/v1`. Si tu backend está en otra dirección, actualiza `src/api/client.js`.

---

## Guía de uso

1. Inicia la API backend en `http://localhost:8080` (o cambia `src/api/client.js`).
2. Ejecuta la app con `npm run dev` y abre el navegador en la URL que te indique Vite (por defecto http://localhost:5173).
3. Regístrate, haz login y prueba crear publicaciones.
4. Navega a un perfil (ruta `/profile/:name`) para ver las publicaciones del usuario. Si no cargan, revisa la consola de red y asegúrate de que la ruta sea `/api/v1/publications/public/<username>` y que la respuesta tenga la forma esperada ({ content, totalPages }).

Consejos de depuración:

- Si el componente de perfil no muestra publicaciones, comprueba `src/components/ProfilePublications.jsx` para ver cómo se construye la URL (usa `encodeURIComponent(name)` y `useInfiniteQuery` con enabled cuando name existe).
- Para problemas de autenticación revisa el `localStorage` y que el `Authorization` sea `Bearer <token>` en las peticiones.

---

## Conclusión

MiniRed es una base de proyecto ideal para practicar integraciones frontend-backend y técnicas modernas de React. Está pensado para ser ampliable: añadir tests, mejor UI, funcionalidad social (me gusta, comentarios) o pruebas de integración sería el siguiente paso natural.

---

## Contribuciones, agradecimientos y referencias

Contribuciones:

- Puedes colaborar creando issues o pull requests. Para cambios importantes crea una rama feature/ o fix/ y abre un PR hacia `main`.

Agradecimientos y referencias:

- Plantillas y documentación de Vite y React.
- React Query: https://tanstack.com/query
- React Router: https://reactrouter.com

---

## Licencia

Codigo bajo`LICENSE MIT`

---

## Contacto

Alumno: **Juan López Ortiz** (DAW)
