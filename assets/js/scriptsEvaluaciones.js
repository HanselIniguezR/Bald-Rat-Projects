// scriptsEvaluaciones.js

const stars = document.querySelectorAll('#rating i');
let currentRating = 0;

stars.forEach(star => {
  star.addEventListener('mouseover', function () {
    const value = this.getAttribute('data-value');
    highlightStars(value);
  });

  star.addEventListener('click', function () {
    currentRating = this.getAttribute('data-value');
    highlightStars(currentRating);
  });

  star.addEventListener('mouseleave', function () {
    highlightStars(currentRating);
  });
});

function highlightStars(rating) {
  stars.forEach(star => {
    if (star.getAttribute('data-value') <= rating) {
      star.classList.add('text-yellow-400');
      star.classList.remove('text-gray-400');
    } else {
      star.classList.add('text-gray-400');
      star.classList.remove('text-yellow-400');
    }
  });
}

function enviarEvaluacion() {
  const comentario = document.getElementById('comentario').value;
  if (currentRating === 0) {
    alert('Por favor selecciona una calificación.');
    return;
  }
  if (comentario.trim() === '') {
    alert('Por favor escribe un comentario.');
    return;
  }
  // Aquí podrías enviar a tu servidor por fetch/ajax
  alert(`Gracias por tu evaluación!\nCalificación: ${currentRating} estrellas\nComentario: ${comentario}`);

  // Reiniciar campos
  currentRating = 0;
  highlightStars(currentRating);
  document.getElementById('comentario').value = '';
}
