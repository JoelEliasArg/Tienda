const API_URL = 'http://localhost:3000/cliente';

document.addEventListener('DOMContentLoaded', listarClientes);

async function listarClientes() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tabla = document.getElementById('tablaCliente');
    tabla.innerHTML = '';

    data.forEach(cliente => {
      const fila = `
        <tr>
          <td>${cliente.id}</td>
          <td>${cliente.nombre}</td>
          <td>${cliente.email}</td>
          <td>${cliente.telefono}</td>
          <td>${cliente.direccion}</td>
        </tr>`;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error('Error al listar clientes:', error);
  }
}

async function registrarCliente(e) {
  e.preventDefault();

  const nuevoCliente = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    direccion: document.getElementById('direccion').value
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoCliente)
    });

    if (res.ok) {
      alert('Cliente registrado con éxito');
      listarClientes();
    }
  } catch (error) {
    console.error('Error al registrar cliente:', error);
  }
}
