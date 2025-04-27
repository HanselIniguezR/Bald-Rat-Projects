// scriptsPostulaciones.js

// Ejemplo de postulaciones (esto lo vas a traer de base de datos en el futuro)
const postulacionesEstudiante = [
  {
    proyecto: "Sistema de Energía Renovable",
    fecha: "2025-04-25",
    estado: "pendiente"
  },
  {
    proyecto: "Aplicación de Salud Mental",
    fecha: "2025-04-20",
    estado: "aceptada"
  },
  {
    proyecto: "Plataforma de E-commerce",
    fecha: "2025-04-15",
    estado: "rechazada"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const tablaPostulaciones = document.getElementById('tablaPostulaciones');
  tablaPostulaciones.innerHTML = ''; // Limpiar contenido anterior

  if (postulacionesEstudiante.length === 0) {
    tablaPostulaciones.innerHTML = `
      <tr>
        <td class="py-3 px-6 text-center text-gray-500" colspan="3">No has realizado ninguna postulación aún.</td>
      </tr>
    `;
    return;
  }

  postulacionesEstudiante.forEach(postulacion => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td class="py-3 px-6 border-b">${postulacion.proyecto}</td>
      <td class="py-3 px-6 border-b">${postulacion.fecha}</td>
      <td class="py-3 px-6 border-b">
        <span class="${getEstadoColor(postulacion.estado)} px-3 py-1 rounded-full text-white text-sm">
          ${postulacion.estado.charAt(0).toUpperCase() + postulacion.estado.slice(1)}
        </span>
      </td>
    `;
    tablaPostulaciones.appendChild(fila);
  });
});

function getEstadoColor(estado) {
  switch (estado) {
    case 'aceptada':
      return 'bg-green-500';
    case 'pendiente':
      return 'bg-yellow-500';
    case 'rechazada':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
}
