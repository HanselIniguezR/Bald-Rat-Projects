// scriptsProyectos.js

// Obtener el rol REAL del usuario logueado
const rolUsuario = localStorage.getItem('role'); // 'admin', 'professor' o 'student'

document.addEventListener('DOMContentLoaded', () => {
  const listaProyectos = document.getElementById('listaProyectos');
  const formularioProyecto = document.getElementById('formularioProyecto');
  const crearProyectoForm = document.getElementById('crearProyectoForm');

  if (rolUsuario === 'admin' || rolUsuario === 'professor') {
    formularioProyecto.classList.remove('hidden'); // Solo admins y profesores ven el formulario
  }

  crearProyectoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombreProyecto').value.trim();
    const descripcion = document.getElementById('descripcionProyecto').value.trim();
    const cupos = parseInt(document.getElementById('cuposProyecto').value.trim(), 10);
    const imagen = document.getElementById('imagenProyecto').value.trim() || 'https://via.placeholder.com/300x200.png?text=Proyecto';
    const fechaPublicacion = new Date().toLocaleDateString();

    if (!nombre || !descripcion || isNaN(cupos) || cupos <= 0) {
      alert('⚠️ Por favor completa correctamente todos los campos.');
      return;
    }

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

// Función simulada de postularse
function postularse(nombreProyecto) {
  alert(`¡Te has postulado al proyecto: ${nombreProyecto}!`);
}
