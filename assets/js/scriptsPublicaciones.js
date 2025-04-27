// scriptsPublicaciones.js

// Obtener el rol REAL del usuario logueado
const rolUsuario = localStorage.getItem('role'); // 'admin', 'professor' o 'student'

document.addEventListener('DOMContentLoaded', () => {
  const listaPublicaciones = document.getElementById('listaPublicaciones');
  const formularioPublicacion = document.getElementById('formularioPublicacion');
  const crearPublicacionForm = document.getElementById('crearPublicacionForm');

  // Solo mostrar el formulario si el rol es admin
  if (rolUsuario === 'admin') {
    formularioPublicacion.classList.remove('hidden');
  }

  crearPublicacionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('tituloPublicacion').value.trim();
    const descripcion = document.getElementById('descripcionPublicacion').value.trim();

    if (titulo === '' || descripcion === '') {
      alert('⚠️ Por favor completa todos los campos.');
      return;
    }

    const nuevaPublicacion = document.createElement('div');
    nuevaPublicacion.classList.add('bg-gray-100', 'p-4', 'rounded-md', 'shadow');
    nuevaPublicacion.innerHTML = `
      <h4 class="text-lg font-semibold mb-2">${titulo}</h4>
      <p class="text-gray-700">${descripcion}</p>
    `;

    // Agregar al inicio
    listaPublicaciones.prepend(nuevaPublicacion);

    // Limpiar formulario
    crearPublicacionForm.reset();
  });
});
