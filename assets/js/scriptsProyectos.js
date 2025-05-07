document.addEventListener('DOMContentLoaded', () => {
  const rolUsuario = localStorage.getItem('role'); // 🔥 obtiene el rol
  const listaProyectos = document.getElementById('listaProyectos');
  const formularioProyecto = document.getElementById('formularioProyecto');
  const crearProyectoForm = document.getElementById('crearProyectoForm');

  // Mostrar formulario si es admin o profesor
  if (rolUsuario === 'admin' || rolUsuario === 'professor') {
    formularioProyecto.classList.remove('hidden');
  }

  crearProyectoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombreProyecto').value.trim();
    const descripcion = document.getElementById('descripcionProyecto').value.trim();
    const cupos = parseInt(document.getElementById('cuposProyecto').value.trim(), 10);
    const imagen = document.getElementById('imagenProyecto').value.trim() || 'https://via.placeholder.com/300x200.png?text=Proyecto';
    const fechaPublicacion = new Date().toLocaleDateString();

    // Validación
    if (!nombre || !descripcion || isNaN(cupos) || cupos <= 0) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const nuevoProyecto = document.createElement('div');
    nuevoProyecto.classList.add('bg-slate-100', 'p-5', 'rounded-lg', 'shadow-md', 'transition-all', 'hover:shadow-lg');

    nuevoProyecto.innerHTML = `
      <img src="${imagen}" alt="Imagen del Proyecto" class="w-full h-48 object-cover rounded-md mb-4">
      <h4 class="text-xl font-bold text-gray-800 mb-2">${nombre}</h4>
      <p class="text-gray-700 mb-2">${descripcion}</p>
      <p class="text-gray-600 mb-1"><strong>Cupos disponibles:</strong> ${cupos}</p>
      <p class="text-gray-400 text-sm mb-3">📅 Publicado el ${fechaPublicacion}</p>
      ${rolUsuario === 'student' ? `<button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition" onclick="postularse('${nombre}')">Postularse</button>` : ''}
    `;

    // Elimina mensaje por defecto si es necesario
    const mensajeDefault = listaProyectos.querySelector('p.text-gray-500');
    if (mensajeDefault) mensajeDefault.remove();

    listaProyectos.prepend(nuevoProyecto);
    crearProyectoForm.reset();
  });
});

function postularse(nombreProyecto) {
  const mensaje = document.createElement('div');
  mensaje.textContent = `✅ Te has postulado al proyecto: ${nombreProyecto}`;
  mensaje.className = 'text-green-600 font-semibold mt-4';
  document.getElementById('listaProyectos').prepend(mensaje);
  setTimeout(() => mensaje.remove(), 3000);
}
