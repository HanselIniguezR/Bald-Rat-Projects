// scriptsProyectos.js

// Simular rol de usuario
const rolUsuario = 'student'; // Opciones: 'admin', 'professor', 'student'

document.addEventListener('DOMContentLoaded', () => {
  const listaProyectos = document.getElementById('listaProyectos');
  const formularioProyecto = document.getElementById('formularioProyecto');
  const crearProyectoForm = document.getElementById('crearProyectoForm');

  if (rolUsuario === 'admin' || rolUsuario === 'professor') {
    formularioProyecto.classList.remove('hidden');
  }

  crearProyectoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombreProyecto').value.trim();
    const descripcion = document.getElementById('descripcionProyecto').value.trim();
    const cupos = document.getElementById('cuposProyecto').value.trim();
    const imagen = document.getElementById('imagenProyecto').value.trim() || 'https://via.placeholder.com/150';

    if (nombre === '' || descripcion === '' || cupos === '') {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const fechaPublicacion = new Date().toLocaleDateString();

    const nuevoProyecto = document.createElement('div');
    nuevoProyecto.classList.add('bg-gray-100', 'p-4', 'rounded-md', 'shadow');
    nuevoProyecto.innerHTML = `
      <img src="${imagen}" alt="Imagen del Proyecto" class="w-full h-48 object-cover rounded-md mb-4">
      <h4 class="text-xl font-semibold mb-2">${nombre}</h4>
      <p class="text-gray-700 mb-2">${descripcion}</p>
      <p class="text-gray-600 mb-2"><strong>Cupos disponibles:</strong> ${cupos}</p>
      <p class="text-gray-500 text-sm mb-4">Publicado el ${fechaPublicacion}</p>
      ${rolUsuario === 'student' ? `<button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onclick="postularse('${nombre}')">Postularse</button>` : ''}
    `;

    listaProyectos.prepend(nuevoProyecto);

    crearProyectoForm.reset();
  });
});

// Función simulada de postulación
function postularse(nombreProyecto) {
  alert(`Te has postulado al proyecto: ${nombreProyecto}`);
}
