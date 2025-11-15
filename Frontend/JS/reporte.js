const API_BASE = 'http://localhost:3000/reportes'; 

document.addEventListener('DOMContentLoaded', () => {
    // Vinculación de eventos
    document.getElementById('formReporteVentasFecha').addEventListener('submit', generarReporteVentasFecha);
    document.getElementById('btnProveedoresInventario').addEventListener('click', generarReporteProveedores);
});

// --- 1. Ventas por Rango de Fecha (Ruta: /reportes/ventas) ---

async function generarReporteVentasFecha(e) {
    e.preventDefault();

    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const resultadoDiv = document.getElementById('resultadoVentasFecha');
    
    if (!fechaInicio || !fechaFin) return alert("Por favor, selecciona ambas fechas.");

    resultadoDiv.innerHTML = 'Cargando ventas...';

    try {
        // RUTA: /reportes/ventas?fechaInicio=...&fechaFin=...
        const url = `${API_BASE}/ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error('Error al obtener el reporte de ventas.');
        
        const compras = await res.json();
        
        let totalVendido = 0;
        
        // Sumamos el campo 'total' de cada compra
        compras.forEach(c => {
            totalVendido += parseFloat(c.total);
        });

        resultadoDiv.innerHTML = `
            <h3>✅ Reporte de Ventas:</h3>
            <p><strong>Rango:</strong> ${fechaInicio} al ${fechaFin}</p>
            <p><strong>Número de Ventas:</strong> ${compras.length}</p>
            <p style="font-size: 1.2em; color: green;"><strong>Total Vendido:</strong> $${totalVendido.toFixed(2)}</p>
        `;

    } catch (error) {
        console.error('Error al generar reporte por fecha:', error);
        resultadoDiv.innerHTML = `<p style="color: red;">❌ Error: ${error.message}</p>`;
    }
}


// --- 2. Proveedores con Mayor Inventario (Ruta: /reportes/proveedores) ---

async function generarReporteProveedores() {
    const tabla = document.getElementById('tablaProveedoresProductos');
    tabla.innerHTML = '<tr><td colspan="2">Cargando...</td></tr>';
    
    try {
        // RUTA: /reportes/proveedores
        const url = `${API_BASE}/proveedores`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error('Error al obtener el reporte de proveedores.');
        
        const proveedores = await res.json();
        
        tabla.innerHTML = '';
        if (proveedores.length === 0) {
            tabla.innerHTML = '<tr><td colspan="2">No hay proveedores registrados.</td></tr>';
            return;
        }

        // El backend devuelve una lista de proveedores con un array de Productos anidado
        
        // 1. Calcular la cantidad de productos por proveedor
        const proveedoresConConteo = proveedores.map(p => ({
            nombre: p.nombre,
            // Contamos los productos asociados
            conteo: p.Productos ? p.Productos.length : 0 
        })).sort((a, b) => b.conteo - a.conteo); // Ordenamos por el conteo descendente

        // 2. Renderizar
        proveedoresConConteo.forEach(p => {
            const fila = `
                <tr>
                    <td>${p.nombre}</td>
                    <td><strong>${p.conteo}</strong> productos</td>
                </tr>`;
            tabla.innerHTML += fila;
        });

    } catch (error) {
        console.error('Error al generar reporte de proveedores:', error);
        tabla.innerHTML = `<tr><td colspan="2" style="color: red;">❌ Error al cargar proveedores: ${error.message}</td></tr>`;
    }
}