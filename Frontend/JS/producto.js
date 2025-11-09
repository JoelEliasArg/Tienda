const API_URL = 'http://localhost:3000/producto';

document.addEventListener('DOMContentLoaded', listarProductos);

async function listarProductos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tabla = document.getElementById('tablaProducto');
    tabla.innerHTML = '';

    data.forEach(prod => {
      const fila = `
        <tr>
          <td>${prod.id}</td>
          <td>${prod.nombre}</td>
          <td>${prod.precio}</td>
          <td>${prod.stock}</td>
          <td>${prod.proveedorId || '—'}</td>
        </tr>`;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error('Error al listar productos:', error);
  }
}

async function registrarProducto(e) {
  e.preventDefault();

  const nuevoProducto = {
    nombre: document.getElementById('nombre').value,
    precio: parseFloat(document.getElementById('precio').value),
    stock: parseInt(document.getElementById('stock').value),
    proveedorId: parseInt(document.getElementById('proveedor').value)
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    });

    if (res.ok) {
      alert('Producto registrado con éxito');
      listarProductos();
    }
  } catch (error) {
    console.error('Error al registrar producto:', error);
  }
}
