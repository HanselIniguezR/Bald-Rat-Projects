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

// Mostrar username
const username = localStorage.getItem("username");
if (username) {
  document.getElementById("username").innerText = username;
}

// Redirecciones
document.getElementById('profileLink').addEventListener('click', () => window.location.href = 'Perfil.html');
document.getElementById('settingsLink').addEventListener('click', () => window.location.href = 'configuracion');
document.getElementById('logoutLink').addEventListener('click', () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
});

// Dropdown de usuario
const userButton = document.getElementById('userButton');
const dropdownMenu = document.getElementById('dropdownMenu');

userButton.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle('hidden');
});
document.addEventListener('click', () => {
  if (!dropdownMenu.classList.contains('hidden')) {
    dropdownMenu.classList.add('hidden');
  }
});

// ============================
// CHAT =======================
// ============================

const API_CHAT = "https://chat-api-v2-xdm0.onrender.com/chat/messages";
const API_USERS = "https://auth-api-v3.onrender.com/auth/users";
const token = localStorage.getItem("access_token");

let senderId = null;
let senderUsername = null;
let receiverId = null;
let socket = null;

// ==============================
// 🔓 TOKEN Y SENDER
// ==============================

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Token inválido:", e);
    return null;
  }
}

function obtenerSenderDesdeToken() {
  if (!token) return;
  const decoded = parseJwt(token);
  if (decoded?.user_id && decoded?.sub) {
    senderId = decoded.user_id;
    senderUsername = decoded.sub;
    console.log("✅ Sender:", senderId, senderUsername);
  } else {
    console.warn("❗ No se pudo obtener sender del token");
  }
}

// ==============================
// 📋 CARGAR USUARIOS
// ==============================

async function cargarUsuarios() {
  try {
    const res = await fetch(API_USERS);
    if (!res.ok) throw new Error(`Error al obtener usuarios: ${res.status}`);
    const usuarios = await res.json();

    const select = document.getElementById("receptor");
    const lista = document.getElementById("lista-colaboradores");

    select.innerHTML = `<option value="">-- Selecciona un usuario --</option>`;
    lista.innerHTML = "";

    usuarios.forEach(user => {
      if (user.username !== senderUsername) {
        const option = document.createElement("option");
        option.value = user.user_id;
        option.textContent = user.username;
        select.appendChild(option);

        const li = document.createElement("li");
        li.textContent = user.username;
        lista.appendChild(li);
      }
    });

  } catch (err) {
    console.error("❌ Error cargando usuarios:", err);
  }
}

// ==============================
// 🔌 WEBSOCKET
// ==============================

function conectarWebSocket() {
  if (!senderId) return;

  socket = new WebSocket(`wss://chat-api-v2-xdm0.onrender.com/ws/chat/${senderId}`);

  socket.onopen = () => {
    console.log("📡 WebSocket conectado");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (parseInt(data.sender_id) === receiverId || parseInt(data.receiver_id) === receiverId) {
      const quien = data.sender_id === senderId ? "Tú" : data.sender_username;
      agregarMensajeAChat(quien, data.content, data.timestamp);
    }
  };

  socket.onclose = () => console.warn("🔌 WebSocket desconectado");
  socket.onerror = (err) => console.error("❌ WebSocket error:", err);
}

// ==============================
// 📜 HISTORIAL
// ==============================

document.getElementById("receptor").addEventListener("change", async (e) => {
  receiverId = parseInt(e.target.value);
  document.getElementById("chatMessages").innerHTML = "";

  if (!receiverId || !senderId) return;
  await cargarHistorial();
});

async function cargarHistorial() {
  try {
    const res = await fetch(`${API_CHAT}/${senderId}/${receiverId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const mensajes = await res.json();
    const contenedor = document.getElementById("chatMessages");
    contenedor.innerHTML = "";

    mensajes.forEach(m => {
      const quien = m.sender_id === senderId ? "Tú" : m.sender_username;
      agregarMensajeAChat(quien, m.content, m.timestamp);
    });

  } catch (err) {
    console.error("❌ Error obteniendo historial:", err);
  }
}

// ==============================
// ✉️ ENVIAR MENSAJE
// ==============================

async function enviarMensaje() {
  const input = document.getElementById("chatInput");
  const mensaje = input.value.trim();

  if (!token) return alert("⚠️ Debes iniciar sesión para enviar mensajes.");
  if (!receiverId) return alert("⚠️ Selecciona un usuario receptor.");
  if (!mensaje) return alert("⚠️ Escribe un mensaje antes de enviarlo.");

  try {
    BotonEnviar.disabled = true;

    const nuevoMensaje = {
      receiver_id: receiverId,
      content: mensaje
    };

    if (socket?.readyState === 1) {
      socket.send(JSON.stringify(nuevoMensaje));
      input.value = "";
    } else {
      alert("❌ WebSocket no está conectado.");
    }
  } catch (err) {
    console.error("❌ Error al enviar mensaje:", err);
    alert("❌ No se pudo enviar el mensaje.\n" + err.message);
  } finally {
    setTimeout(() => BotonEnviar.disabled = false, 1000);
  }
}

// ==============================
// 💬 MOSTRAR MENSAJE
// ==============================

function agregarMensajeAChat(nombre, mensaje, hora) {
  const contenedor = document.getElementById("chatMessages");
  const nuevoMensaje = document.createElement("div");

  const esPropio = nombre === "Tú";
  nuevoMensaje.className = `mb-2 p-2 rounded-lg max-w-xs ${esPropio ? "bg-blue-100 ml-auto text-right" : "bg-gray-200 mr-auto text-left"}`;
  nuevoMensaje.innerHTML = `
    <div class="text-sm font-semibold">${nombre}</div>
    <div>${mensaje}</div>
    <div class="text-xs text-gray-500 mt-1">${formatearHora(hora)}</div>
  `;

  contenedor.appendChild(nuevoMensaje);

  // 🔽 Baja automáticamente solo si estás ya abajo
// 👇 Scroll al final después de pintar todos
document.getElementById("chatMessages").scrollTop =
  document.getElementById("chatMessages").scrollHeight;
  }


// 👇 Scroll al final después de pintar todos
document.getElementById("chatMessages").scrollTop =
  document.getElementById("chatMessages").scrollHeight;


function formatearHora(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ==============================
// 🚀 INICIALIZACIÓN
// ==============================

window.addEventListener("DOMContentLoaded", async () => {
  obtenerSenderDesdeToken();
  await cargarUsuarios();
  conectarWebSocket();
});
