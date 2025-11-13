// index.js

const API_PRODUCTO = 'http://localhost:3000/productos';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica de Animaciones (Mantenida de tu código original) ---

    // Fade-in para elementos
    const fadeElements = document.querySelectorAll('.logo, .navbar, .content-box, .titulo-principal, .subtitulo');
    fadeElements.forEach(el => {
        el.style.opacity = 0;
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease';
            el.style.opacity = 1;
        }, 100);
    });

    // Zoom-in en tarjetas (Aplica si tienes la clase .card en index.html)
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('zoom'));
        card.addEventListener('mouseleave', () => card.classList.remove('zoom'));
    });
    
    // ------------------------------------------------------------------

    // --- Lógica de Carga de Productos para la Página de Inicio ---
    cargarProductosIndex();
});


async function cargarProductosIndex() {
    const container = document.getElementById('productosContainer');
    // Muestra un mensaje de carga mientras se obtienen los datos
    container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Cargando productos...</p>'; 

    try {
        // Solicitamos los productos. Usamos el filtro ?activo=1 para mostrar solo los disponibles.
        const res = await fetch(`${API_PRODUCTO}?activo=1`);
        
        if (!res.ok) {
            // Si hay un error 4xx o 5xx, lanzamos la excepción
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error desconocido al obtener productos.');
        }
        
        const productos = await res.json();
        
        container.innerHTML = ''; // Limpiar el mensaje de carga

        if (productos.length === 0) {
            container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No hay productos activos para mostrar en la tienda.</p>';
            return;
        }

        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'producto-card'; // Clase CSS para la visualización en cuadrícula

            // Formatear el precio a dos decimales
            const precioFormateado = `$${producto.precio ? producto.precio.toFixed(2) : '0.00'}`;

            // Contenido de la tarjeta
            card.innerHTML = `
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion || 'Sin descripción disponible.'}</p>
                <p class="producto-precio">${precioFormateado}</p>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar productos para la página de inicio:', error);
        container.innerHTML = `<p class="error" style="grid-column: 1 / -1; text-align: center;">❌ Error al cargar los productos: ${error.message}</p>`;
    }
}