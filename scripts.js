const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

async function sendRequest(url, method, data) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error en la solicitud");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error:", error.message);
        alert("⚠️ " + error.message);
        throw error;
    }
}

function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.querySelector("p").innerText = message;
    popup.style.display = "block";

    document.addEventListener('keydown', handleEscKey);
}

function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";

    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        closePopup();
    }
}

document.querySelector('.sign-up-container form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        username: document.getElementById('signup-name').value.trim(),
        email: document.getElementById('signup-email').value.trim(),
        password: document.getElementById('signup-password').value.trim(),
    };

    if (!data.username || !data.email || !data.password) {
        alert("⚠️ Todos los campos son obligatorios.");
        return;
    }

    try {
        const response = await sendRequest('https://auth-api-v2-398o.onrender.com/auth/register', 'POST', data);
        console.log('✅ Registro exitoso:', response);
        showPopup("Usuario registrado correctamente.");
    } catch (error) {
        console.error(error);
    }
});

document.querySelector('.sign-in-container form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        email: document.getElementById('signin-email').value.trim(),
        password: document.getElementById('signin-password').value.trim(),
    };

    if (!data.email || !data.password) {
        alert("⚠️ Todos los campos son obligatorios.");
        return;
    }

    try {
        const response = await sendRequest('https://auth-api-v2-398o.onrender.com/auth/login', 'POST', data);

        if (response.access_token) {
            localStorage.setItem('access_token', response.access_token); // Guardar el token
            localStorage.setItem('role', response.role); // Guardar el rol
            localStorage.setItem('username', response.username); // Guardar el nombre de usuario
            console.log('✅ Inicio de sesión exitoso:', response);
            console.log('🔹 Rol del usuario:', response.role);
            console.log('🔹 Nombre de usuario:', response.username);
            showPopup("Inicio de sesión exitoso.");

            // Redirigir siempre a main.html después de iniciar sesión
            setTimeout(() => {
                window.location.href = "MenuPrincipal.html";
            }, 1500);
        } else {
            alert("⚠️ No se recibió un token de acceso.");
        }
    } catch (error) {
        console.error(error);
    }
});
