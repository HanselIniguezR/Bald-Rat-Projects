const stars = document.querySelectorAll('#rating i');
let currentRating = 0;
let todasLasEvaluaciones = [];

// ⭐ Manejo de estrellas
stars.forEach(star => {
  star.addEventListener('mouseover', () => highlightStars(star.getAttribute('data-value')));
  star.addEventListener('click', () => {
    currentRating = star.getAttribute('data-value');
    highlightStars(currentRating);
  });
  star.addEventListener('mouseleave', () => highlightStars(currentRating));
});

function highlightStars(rating) {
  stars.forEach(star => {
    const value = star.getAttribute('data-value');
    if (value <= rating) {
      star.classList.add('text-yellow-400');
      star.classList.remove('text-gray-400');
    } else {
      star.classList.add('text-gray-400');
      star.classList.remove('text-yellow-400');
    }
  });
}

async function enviarEvaluacion() {
  const comentario = document.getElementById('comentario').value.trim();
  const token = localStorage.getItem('access_token');

  if (!token) return alert("⚠️ Debes iniciar sesión para enviar una evaluación.");
  if (currentRating === 0) return alert('⚠️ Por favor selecciona una calificación.');
  if (comentario === '') return alert('⚠️ Por favor escribe un comentario.');

  try {
    const response = await fetch("https://evaluaciones-api-v1.onrender.com/evaluaciones/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        estrellas: parseInt(currentRating),
        comentario
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al enviar evaluación.");
    }

    alert("✅ ¡Gracias por tu evaluación!");
    currentRating = 0;
    highlightStars(currentRating);
    document.getElementById('comentario').value = '';

    await cargarEvaluaciones(); // Recargar comentarios
  } catch (error) {
    console.error("❌ Error al enviar evaluación:", error);
    alert("❌ Ocurrió un error.\n" + error.message);
  }
}

async function cargarEvaluaciones() {
  const lista = document.getElementById('lista-evaluaciones');
  const verMasBtn = document.getElementById('ver-mas-btn');

  try {
    const response = await fetch("https://evaluaciones-api-v1.onrender.com/evaluaciones/");
    if (!response.ok) throw new Error("Error al obtener evaluaciones.");
    const data = await response.json();

    todasLasEvaluaciones = data;
    lista.innerHTML = ''; // Limpiar anteriores

    const mostrar = data.slice(0, 4);
    mostrar.forEach(e => agregarEvaluacionAlDOM(e, lista));

    verMasBtn.classList.toggle('hidden', data.length <= 4);

  } catch (error) {
    console.error("❌ Error cargando evaluaciones:", error);
    lista.innerHTML = "<p class='text-gray-500'>No se pudieron cargar las evaluaciones.</p>";
  }
}

function agregarEvaluacionAlDOM(eval, contenedor) {
  const div = document.createElement('div');
  div.className = "p-4 border rounded-md shadow-sm bg-gray-50";
  div.innerHTML = `
    <div class="flex items-center justify-between mb-1">
      <strong>${eval.username || 'Usuario Anónimo'}</strong>
      <span class="text-yellow-500">${'★'.repeat(eval.estrellas)}${'☆'.repeat(5 - eval.estrellas)}</span>
    </div>
    <p class="text-gray-700">${eval.comentario}</p>
    <p class="text-sm text-gray-400 mt-1">${new Date(eval.fecha).toLocaleString()}</p>
  `;
  contenedor.appendChild(div);
}

function mostrarTodasLasEvaluaciones() {
  const lista = document.getElementById('lista-evaluaciones');
  const verMasBtn = document.getElementById('ver-mas-btn');

  lista.innerHTML = '';
  todasLasEvaluaciones.forEach(e => agregarEvaluacionAlDOM(e, lista));
  verMasBtn.classList.add('hidden');
}

// Cargar al entrar
document.addEventListener('DOMContentLoaded', cargarEvaluaciones);
