console.log("🎯 El archivo admin.js está cargado correctamente.");
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM completamente cargado.");

    const liveButton = document.getElementById("send-live-notification");
    const saveButton = document.getElementById("save-notification-form");
    const specificForm = document.getElementById("send-specific-notification");

    if (!liveButton || !saveButton || !specificForm) {
        console.error("❌ Error: Uno o más elementos no se encontraron en el DOM.");
        return;
    }

    liveButton.addEventListener("click", function () {
        console.log("Botón de notificación en vivo clickeado.");
    });

    saveButton.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("Formulario de guardar notificación enviado.");
    })});

document.addEventListener("DOMContentLoaded", function () {
        const saveButton = document.getElementById("save-notification-form");
    
        if (!saveButton) {
            console.error("❌ Error: No se encontró el formulario de guardar notificación.");
            return;
        }
    
        saveButton.addEventListener("submit", function (event) {
            event.preventDefault(); // Evita que el formulario se envíe de forma tradicional
    
            console.log("Formulario de guardar notificación enviado.");
    
            // Obtener valores del formulario
            const notificationId = document.getElementById("notification-id").value;
            const userId = document.getElementById("user-id").value;
            const type = document.getElementById("type").value;
            const title = document.getElementById("title").value;
            const message = document.getElementById("message").value;
            const status = document.getElementById("status").value;
            const createdAt = document.getElementById("created-at").value;
            const readAt = document.getElementById("read-at").value;
    
            // Crear el objeto con los datos del formulario
            const formData = {
                notification_id: notificationId,
                user_id: userId,
                type: type,
                title: title,
                message: message,
                status: status,
                created_at: createdAt,
                read_at: readAt
            };
    
            console.log("Datos del formulario:", formData);
    
            // Enviar la solicitud al servidor
            fetch("http://localhost:5000/save_notification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                console.log("Respuesta del servidor:", response);
                return response.json();
            })
            .then(result => {
                console.log("Resultado de la respuesta del servidor:", result);
                if (result.success) {
                    alert("✅ Notificación guardada correctamente");
                } else {
                    alert("❌ Error al guardar la notificación: " + result.error);
                }
            })
            .catch(error => {
                console.error("❌ Error al enviar la solicitud:", error);
                alert("❌ Error al enviar la solicitud");
            });
        });
    });
console.log("🎯 El archivo admin.js está cargado correctamente.");
document.addEventListener("DOMContentLoaded", function () {
    fetchNotifications();
});

function fetchNotifications() {
    fetch("http://localhost:5000/notifications")  // sin user_id
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
