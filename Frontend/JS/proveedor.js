// proveedor.js
// ⚠️ Corregido: La ruta correcta es /proveedores (plural)
const API_URL = 'http://localhost:3000/proveedores'; 

document.addEventListener('DOMContentLoaded', () => {
    // Vinculación del formulario de registro
    document.getElementById('formProveedor').addEventListener('submit', registrarProveedor);

    // Vinculación del botón para listar proveedores
    document.getElementById('btnListarProveedores').addEventListener('click', listarProveedores);
});

// --- Funciones de Consumo de API ---

async function listarProveedores() {
    try {
        const tabla = document.getElementById('tablaProveedores'); // ⚠️ Corregido: ID del tbody es 'tablaProveedores'

        // 1. Fetch de datos
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error al obtener la lista de proveedores: ' + res.statusText);
        
        const data = await res.json();

        // 2. Limpiar y renderizar tabla
        tabla.innerHTML = '';

        if (data.length === 0) {
            tabla.innerHTML = '<tr><td colspan="7">No hay proveedores registrados.</td></tr>';
            return;
        }

        data.forEach(prov => {
            const fila = `
                <tr>
                    <td>${prov.id}</td>
                    <td>${prov.nombre}</td>
                    <td>${prov.contacto || 'N/A'}</td>
                    <td>${prov.telefono || 'N/A'}</td>
                    <td>${prov.email || 'N/A'}</td>
                    <td>${prov.direccion || 'N/A'}</td>
                    <td>
                        <button onclick="alert('Funcionalidad de Edición')">✏️</button>
                        <button onclick="alert('Funcionalidad de Eliminación')">🗑️</button>
                    </td>
                </tr>`;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error('Error al listar proveedores:', error);
        alert('Hubo un error al cargar los proveedores.');
    }
}

async function registrarProveedor(e) {
    e.preventDefault();

    const form = e.target;
    
    // Recolección de todos los campos del modelo Proveedor
    const nuevoProveedor = {
        nombre: document.getElementById('nombre').value.trim(),
        contacto: document.getElementById('contacto').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim(),
        direccion: document.getElementById('direccion').value.trim()
    };
    
    // Opcional: Eliminar campos vacíos para no enviar strings si no son requeridos
    Object.keys(nuevoProveedor).forEach(key => {
        if (nuevoProveedor[key] === '') {
            delete nuevoProveedor[key];
        }
    });

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProveedor)
        });

        const data = await res.json();
        
        if (res.ok) {
            alert('✅ Proveedor ' + data.nombre + ' registrado con éxito.');
            form.reset(); // Limpiar el formulario
            listarProveedores(); // Actualizar la tabla
        } else {
            // Manejo genérico de errores 400 o 500
            throw new Error(data.error || 'Error desconocido al registrar proveedor.');
        }
    } catch (error) {
        console.error('Error al registrar proveedor:', error);
        alert('❌ Error: ' + error.message);
    }
}