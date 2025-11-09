const API_URL = 'http://localhost:3000/proveedor';

document.addEventListener('DOMContentLoaded', listarProveedores);

async function listarProveedores() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tabla = document.getElementById('tablaProveedor');
    tabla.innerHTML = '';

    data.forEach(prov => {
      const fila = `
        <tr>
          <td>${prov.id}</td>
          <td>${prov.nombre}</td>
          <td>${prov.telefono}</td>
          <td>${prov.direccion}</td>
        </tr>`;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error('Error al listar proveedores:', error);
  }
}

async function registrarProveedor(e) {
  e.preventDefault();

  const nuevoProveedor = {
    nombre: document.getElementById('nombre').value,
    telefono: document.getElementById('telefono').value,
    direccion: document.getElementById('direccion').value
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProveedor)
    });

    if (res.ok) {
      alert('Proveedor registrado con éxito');
      listarProveedores();
    }
  } catch (error) {
    console.error('Error al registrar proveedor:', error);
  }
}
