document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  // Animación de zoom
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
      card.style.transition = 'transform 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
    });
  });

  // Redirección a las páginas correspondientes
  document.getElementById('cardCliente').onclick = () => location.href = 'cliente.html';
  document.getElementById('cardProducto').onclick = () => location.href = 'producto.html';
  document.getElementById('cardProveedor').onclick = () => location.href = 'proveedor.html';
});
