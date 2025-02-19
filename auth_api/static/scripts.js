const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Función para mostrar el popup de éxito
function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.querySelector("p").innerText = message;
    popup.style.display = "block";

    // Agregar el listener para cerrar con 'Esc'
    document.addEventListener('keydown', handleEscKey);
}

// Función para cerrar el popup
function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";

    // Remover el listener cuando el popup esté cerrado
    document.removeEventListener('keydown', handleEscKey);
}

// Función para manejar la tecla 'Esc'
function handleEscKey(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        closePopup();
    }
}

// Enviar datos del formulario de registro al backend
document.querySelector('.sign-up-container form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita el envío predeterminado del formulario

    const data = {
        username: document.getElementById('signup-name').value,
        email: document.getElementById('signup-email').value,
        password: document.getElementById('signup-password').value,
    };

    fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.detail || "Error en el registro"); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Registro exitoso:', data);
        showPopup("Usuario registrado correctamente.");
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert('Error en el registro: ' + error.message);
    });
});

// Enviar datos del formulario de inicio de sesión al backend
document.querySelector('.sign-in-container form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita el envío predeterminado del formulario

    const data = {
        email: document.getElementById('signin-email').value,
        password: document.getElementById('signin-password').value,
    };

    fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.detail || "Error al iniciar sesión"); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Inicio de sesión exitoso:', data);
        localStorage.setItem('access_token', data.access_token); // Guardar el token
        showPopup("Inicio de sesión exitoso.");
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert('Error al iniciar sesión: ' + error.message);
    });
});
