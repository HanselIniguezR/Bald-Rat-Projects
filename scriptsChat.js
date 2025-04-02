const sidebar = document.getElementById("sidebar");
const spans = sidebar.getElementsByTagName("span");

sidebar.addEventListener("mouseenter", () => {
  sidebar.classList.add("w-64");
  sidebar.classList.remove("w-20");
  for (let span of spans) span.classList.remove("hidden");
});

sidebar.addEventListener("mouseleave", () => {
  sidebar.classList.add("w-20");
  sidebar.classList.remove("w-64");
  for (let span of spans) span.classList.add("hidden");
});

document.getElementById("toggleSidebar").addEventListener("click", () => {
  sidebar.classList.toggle("w-64");
  sidebar.classList.toggle("w-20");
  for (let span of spans) span.classList.toggle("hidden");
});

function obtenerHora() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function enviarMensaje() {
  const input = document.getElementById("chatInput");
  const mensaje = input.value.trim();
  if (mensaje !== "") {
    const contenedor = document.getElementById("chatMessages");
    const nuevoMensaje = document.createElement("div");
    nuevoMensaje.className = "text-sm mb-2 chat-msg";
    nuevoMensaje.innerHTML = `<strong>Tú:</strong> ${mensaje} <span class="text-xs text-gray-500 ml-2">${obtenerHora()}</span>`;
    contenedor.appendChild(nuevoMensaje);
    input.value = "";
    contenedor.scrollTop = contenedor.scrollHeight;
    setTimeout(respuestaAutomatica, 1000);
  }
}

function respuestaAutomatica() {
  const respuestas = ["Estoy revisando eso...", "Buena idea.", "Perfecto.", "¿Podrías explicarlo más?", "Ok, te confirmo pronto."];
  const contenedor = document.getElementById("chatMessages");
  const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
  const mensajeBot = document.createElement("div");
  mensajeBot.className = "text-sm mb-2 text-blue-700 chat-msg";
  mensajeBot.innerHTML = `<strong>Bot:</strong> ${respuesta} <span class="text-xs text-gray-500 ml-2">${obtenerHora()}</span>`;
  contenedor.appendChild(mensajeBot);
  contenedor.scrollTop = contenedor.scrollHeight;
}
