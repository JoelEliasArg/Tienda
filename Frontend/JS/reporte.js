const API_URL = 'http://localhost:3000/reporte';

document.addEventListener('DOMContentLoaded', generarReporte);

async function generarReporte() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const contenedor = document.getElementById('reporteContainer');
    contenedor.innerHTML = `
      <h3>Total de clientes: ${data.totalClientes}</h3>
      <h3>Total de productos: ${data.totalProductos}</h3>
      <h3>Total de compras: ${data.totalCompras}</h3>
      <h3>Ganancias totales: $${data.gananciasTotales.toFixed(2)}</h3>
    `;
  } catch (error) {
    console.error('Error al generar reporte:', error);
  }
}
