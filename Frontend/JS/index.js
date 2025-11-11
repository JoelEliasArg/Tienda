// INICIO.JS – Animaciones del dashboard / inicio

document.addEventListener('DOMContentLoaded', () => {
  // Fade-in para logo, navbar, y box blanca
  const fadeElements = document.querySelectorAll('.logo, .navbar, .content-box, .titulo-principal, .subtitulo');
  fadeElements.forEach(el => {
    el.style.opacity = 0;
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease';
      el.style.opacity = 1;
    }, 100);
  });

  // Zoom-in en tarjetas
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('zoom'));
    card.addEventListener('mouseleave', () => card.classList.remove('zoom'));
  });
});
