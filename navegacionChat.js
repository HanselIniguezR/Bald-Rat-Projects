const secciones = {
  principal: document.getElementById("contenido-principal"),
  chat: document.getElementById("chat-colab"),
  postulaciones: document.getElementById("postulaciones"),
  publicaciones: document.getElementById("publicaciones"),
  evaluaciones: document.getElementById("evaluaciones"),
  administracion: document.getElementById("administracion"),
};

function mostrarSeccion(nombre) {
  Object.entries(secciones).forEach(([clave, seccion]) => {
    if (clave === nombre) {
      seccion.classList.remove("hidden");
    } else {
      seccion.classList.add("hidden");
    }
  });
}

document.getElementById("inicioLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("principal"); });
document.getElementById("chatLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("chat"); });
document.getElementById("postulacionesLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("postulaciones"); });
document.getElementById("publicacionesLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("publicaciones"); });
document.getElementById("evaluacionesLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("evaluaciones"); });
document.getElementById("adminLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("administracion"); });
