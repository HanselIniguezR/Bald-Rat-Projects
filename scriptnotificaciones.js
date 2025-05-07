document.addEventListener("DOMContentLoaded", function () {
    fetchNotifications();
});


function fetchNotifications() {
    fetch("https://notificaciones-api-v2.onrender.com/notifications?user_id=1")
        .then(response => response.json())
        .then(data => {
            console.log("Notificaciones recibidas:", data);
            updateNotificationUI(data);
        })
        .catch(error => console.error("Error cargando notificaciones:", error));
}

function updateNotificationUI(notifications) {
    const notificationCount = document.getElementById("notification-count");
    
    if (!notificationCount) {
        console.error("Elemento 'notification-count' no encontrado en el DOM.");
        return;
    }

    const count = notifications.length;
    notificationCount.textContent = count > 0 ? count : "";
    notificationCount.classList.toggle("hidden", count === 0);

    let notificationContainer = document.getElementById("notification-list");
    notificationContainer.innerHTML = "";

    if (notifications.length === 0) {
        notificationContainer.innerHTML = "<p>No hay notificaciones</p>";
        return;
    }

    notifications.forEach(notif => {
        let notifItem = document.createElement("div");
        notifItem.classList.add("notification-item");
        notifItem.innerHTML = `<strong>${notif.title}</strong><p>${notif.message}</p>`;
        notificationContainer.appendChild(notifItem);
    });

    

}

// Función para desplegar las notificaciones
function toggleNotifications() {
    let dropdown = document.getElementById("notification-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", function () {
    const registerButton = document.getElementById("register-button");

    if (!registerButton) {
        console.error("❌ Error: No se encontró el botón de registro en el DOM.");
        return;
    }

    registerButton.addEventListener("click", function () {
        fetch("https://notificaciones-api-v2.onrender.com/send_welcome_email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("❌ Error enviando email:", data.error);
            } else {
                console.log("✅ Email enviado:", data.message);
            }
        })
        .catch(error => console.error("❌ Error en fetch:", error));
    });
});



function sendMessageNotification(userId, senderName) {
    fetch("https://notificaciones-api-v2.onrender.com/send_message_notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, sender_name: senderName })
    })
    .then(response => response.json())
    .then(data => console.log("✅ Notificación de mensaje enviada:", data))
    .catch(error => console.error("❌ Error enviando notificación:", error));
}


function updateTramiteStatus(tramiteId, userId, newStatus, tramiteName) {
    fetch("https://notificaciones-api-v2.onrender.com/update_tramite_status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tramite_id: tramiteId, user_id: userId, new_status: newStatus, tramite_name: tramiteName })
    })
    .then(response => response.json())
    .then(data => console.log("✅ Trámite actualizado:", data))
    .catch(error => console.error("❌ Error actualizando trámite:", error));
}

function sendWelcomeNotification(userId) {
    fetch("https://notificaciones-api-v2.onrender.com/send_welcome_notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
    })
    .then(response => response.json())
    .then(data => console.log("✅ Notificación de bienvenida enviada:", data))
    .catch(error => console.error("❌ Error enviando notificación:", error));
}
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.notification-container');
    const icon = container.querySelector('.notification-icon');
    const dropdown = document.getElementById('notification-dropdown');

    let notificationPinned = false;

    // Mostrar temporalmente con mouseover
    container.addEventListener('mouseenter', () => {
        if (!notificationPinned) {
            dropdown.style.display = 'block';
        }
    });

    container.addEventListener('mouseleave', () => {
        if (!notificationPinned) {
            dropdown.style.display = 'none';
        }
    });

    // Click para fijar o liberar
    icon.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el click se propague
        notificationPinned = !notificationPinned;
        dropdown.style.display = notificationPinned ? 'block' : 'none';
    });

    // Click fuera del dropdown e icono
    document.addEventListener('click', (e) => {
        if (
            notificationPinned &&
            !container.contains(e.target)
        ) {
            notificationPinned = false;
            dropdown.style.display = 'none';
        }
    });
});

