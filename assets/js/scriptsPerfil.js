// scriptsPerfil.js

document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos del localStorage
    const username = localStorage.getItem('username') || 'No disponible';
    const email = localStorage.getItem('email') || 'No disponible';
    const role = localStorage.getItem('role') || 'No disponible';
    const userId = localStorage.getItem('user_id') || 'No disponible';
  
    // Insertar datos en el HTML
    document.getElementById('perfil-username').textContent = username;
    document.getElementById('perfil-email').textContent = email;
    document.getElementById('perfil-role').textContent = role.charAt(0).toUpperCase() + role.slice(1);
    document.getElementById('perfil-userid').textContent = userId;
  });
  
