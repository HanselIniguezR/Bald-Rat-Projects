const secciones = {
  principal: document.getElementById("contenido-principal"),
  proyectos: document.getElementById("proyectos"),
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

async function cargarMensajes() {
  try {
    const response = await fetch(`http://localhost:8000/chat/messages/${senderId}/${receiverId}`);
    const mensajes = await response.json();
    const contenedor = document.getElementById("chatMessages");
    contenedor.innerHTML = "";
    mensajes.forEach(msg => {
      const nombre = msg.sender_id === senderId ? "Tú" : "Usuario";
      agregarMensajeAChat(nombre, msg.content, msg.timestamp);
    });
  } catch (error) {
    console.error("Error al cargar mensajes:", error);
  }
}

// Llamar cuando se muestra la sección de chat
document.getElementById("chatLink").addEventListener("click", (e) => {
  e.preventDefault();
  mostrarSeccion("chat");
  cargarMensajes();
});


document.getElementById("inicioLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("principal"); });
document.getElementById("proyectosLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("proyectos"); });
document.getElementById("chatLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("chat"); });
document.getElementById("postulacionesLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("postulaciones"); });
document.getElementById("publicacionesLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("publicaciones"); });
document.getElementById("evaluacionesLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("evaluaciones"); });
document.getElementById("adminLink").addEventListener("click", (e) => { e.preventDefault(); mostrarSeccion("administracion"); });
