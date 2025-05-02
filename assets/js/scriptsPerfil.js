// scriptsPerfil.js

document.addEventListener('DOMContentLoaded', () => {
  const fotoPerfilPreview = document.getElementById('fotoPerfilPreview');
  const inputFotoPerfil = document.getElementById('input-fotoPerfil');
  const guardarFotoBtn = document.getElementById('guardarFotoBtn');
  const inputPassword = document.getElementById('input-password');
  const actualizarPasswordBtn = document.getElementById('actualizarPasswordBtn');

  // Mostrar datos básicos
  const username = localStorage.getItem('username') || 'No disponible';
  const email = localStorage.getItem('email') || 'No disponible';
  const role = localStorage.getItem('role') || 'No disponible';
  const userId = localStorage.getItem('user_id') || 'No disponible';
  const fotoGuardada = localStorage.getItem('foto_perfil');

  document.getElementById('perfil-username').textContent = username;
  document.getElementById('perfil-email').textContent = email;
  document.getElementById('perfil-role').textContent = role.charAt(0).toUpperCase() + role.slice(1);
  document.getElementById('perfil-userid').textContent = userId;

  // Mostrar foto si había una guardada
  if (fotoGuardada) {
    fotoPerfilPreview.src = fotoGuardada;
  }

  // Previsualizar imagen cuando se selecciona
  inputFotoPerfil.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        fotoPerfilPreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Guardar nueva foto de perfil
  guardarFotoBtn.addEventListener('click', () => {
    const file = inputFotoPerfil.files[0];
    if (!file) {
      alert("⚠️ Selecciona una imagen primero.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      const base64Image = event.target.result;
      localStorage.setItem('foto_perfil', base64Image);
      alert("✅ Foto de perfil actualizada.");
    };
    reader.readAsDataURL(file);
  });

  // Actualizar contraseña
  actualizarPasswordBtn.addEventListener('click', async () => {
    const nuevaPassword = inputPassword.value.trim();
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    if (!nuevaPassword) {
      alert("⚠️ Escribe una nueva contraseña.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/auth/update_user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: nuevaPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al actualizar contraseña");
      }

      alert('✅ Contraseña actualizada correctamente.');
      inputPassword.value = ""; // Limpiar campo después de actualizar
    } catch (error) {
      console.error(error);
      alert("⚠️ Error al actualizar contraseña.");
    }
  });
});
