const API_URL = 'http://localhost:3000/compra';

document.addEventListener('DOMContentLoaded', listarCompras);

async function listarCompras() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tabla = document.getElementById('tablaCompra');
    tabla.innerHTML = '';

    data.forEach(c => {
      const fila = `
        <tr>
          <td>${c.id}</td>
          <td>${c.clienteId}</td>
          <td>${c.total}</td>
          <td>${new Date(c.fecha).toLocaleDateString()}</td>
        </tr>`;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error('Error al listar compras:', error);
  }
}

async function registrarCompra(e) {
  e.preventDefault();

  const nuevaCompra = {
    clienteId: parseInt(document.getElementById('clienteId').value),
    total: parseFloat(document.getElementById('total').value)
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaCompra)
    });

    if (res.ok) {
      alert('Compra registrada con éxito');
      listarCompras();
    }
  } catch (error) {
    console.error('Error al registrar compra:', error);
  }
}
