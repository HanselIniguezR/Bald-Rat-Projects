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

// Mostrar el username desde localStorage
const username = localStorage.getItem('username');
if (username) {
    document.getElementById('username').innerText = username;
}

// Mostrar y ocultar el menú desplegable al hacer clic
const dropdown = document.querySelector('.dropdown');
document.getElementById('userButton').addEventListener('click', function() {
    dropdown.classList.toggle('active');
});

// Manejo de enlaces en el menú
document.getElementById('profileLink').addEventListener('click', function() {
    window.location.href = 'Perfil.html'; // Cambia la URL al perfil del usuario
});

    document.getElementById('settingsLink').addEventListener('click', function() {
    window.location.href = 'configuracion'; // Cambia la URL a configuración
});

    document.getElementById('logoutLink').addEventListener('click', function() {
    // Eliminar el token de acceso y redirigir al login
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    window.location.href = 'login.html'; // Redirigir a la página de inicio de sesión
});

function obtenerHora() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const senderId = 1;  // ID real del usuario autenticado
const receiverId = 2; // ID del destinatario seleccionado

async function enviarMensaje() {
  const input = document.getElementById("chatInput");
  const mensaje = input.value.trim();
  if (mensaje === "") return;

  const nuevoMensaje = {
    sender_id: senderId,
    receiver_id: receiverId,
    content: mensaje
  };

  try {
    BotonEnviar.disabled = true;
    const response = await fetch("http://localhost:8000/chat/messages/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoMensaje)
    });      setTimeout(()=>{
      BotonEnviar.disabled=false;},1000);

    const data = await response.json();
    agregarMensajeAChat("Tú", data.content, data.timestamp);
    input.value = "";
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
  }
}

function agregarMensajeAChat(nombre, mensaje, hora) {
  const contenedor = document.getElementById("chatMessages");
  const nuevoMensaje = document.createElement("div");
  nuevoMensaje.className = "text-sm mb-2 chat-msg";
  nuevoMensaje.innerHTML = `<strong>${nombre}:</strong> ${mensaje} <span class="text-xs text-gray-500 ml-2">${formatearHora(hora)}</span>`;
  contenedor.appendChild(nuevoMensaje);
  contenedor.scrollTop = contenedor.scrollHeight;
}

function formatearHora(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getusers() {
  fetch("http://localhost:8000/users_colab/")
     .then(res => res.json())
     .then(data => {
        // Suponiendo que tienes los elementos con id "1", "2", "3" en tu HTML
        const primerColaborador = data[0];
        const segundoColaborador = data[1];
        const tercerColaborador = data[2];

        // Accede a cada p por su id y asigna el nombre de usuario
        const primerColab = document.getElementById("1");
        const segundoColab = document.getElementById("2");
        const tercerColab = document.getElementById("3");

        // Actualiza el contenido de cada p con el nombre de usuario
        primerColab.textContent = `${primerColaborador.username}`;
        segundoColab.textContent = `${segundoColaborador.username}`;
        tercerColab.textContent = `${tercerColaborador.username}`;
     })
     .catch(error => console.log("Error fetching data: ", error));
}

window.onload = getusers;



