// detalles_producto.js
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("❌ No se encontró el ID del producto.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/producto/${id}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.mensaje || "Error al cargar el producto.");

    const producto = data.producto;

    document.getElementById("producto-imagen").src = producto.imagen || "images/default.png";
    document.getElementById("producto-nombre").textContent = producto.nombre;
    document.getElementById("producto-descripcion").textContent = producto.descripcion;
    document.getElementById("producto-precio").textContent = `$ ${producto.precio.toLocaleString()}`;
    document.getElementById("producto-stock").textContent = `Stock: ${producto.stock}`;

  } catch (error) {
    alert("❌ " + error.message);
  }
});
