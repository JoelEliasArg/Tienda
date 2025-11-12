// cliente.js
const API_URL = 'http://localhost:3000/clientes'; // ⚠️ Corregido: 'cliente' -> 'clientes'

document.addEventListener('DOMContentLoaded', () => {
    // Vinculación del formulario de registro
    document.getElementById('formCliente').addEventListener('submit', registrarCliente);

    // Vinculación del nuevo botón para listar clientes
    document.getElementById('btnListarClientes').addEventListener('click', listarClientes);

    // Opcional: Si quieres que la lista se cargue al inicio, descomenta la línea de abajo:
    // listarClientes();
});

// --- Funciones de Consumo de API ---

async function listarClientes() {
    try {
        const tabla = document.getElementById('tablaClientes'); // ⚠️ Corregido: 'tablaCliente' -> 'tablaClientes'

        // 1. Fetch de datos
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error al obtener la lista de clientes: ' + res.statusText);
        
        const data = await res.json();

        // 2. Limpiar y renderizar tabla
        tabla.innerHTML = '';

        if (data.length === 0) {
            tabla.innerHTML = '<tr><td colspan="6">No hay clientes registrados.</td></tr>';
            return;
        }

        data.forEach(cliente => {
            // Incluye la columna 'direccion' y una columna vacía para 'Acciones'
            const fila = `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefono || 'N/A'}</td>
                    <td>${cliente.direccion || 'N/A'}</td>
                    <td>
                        <button onclick="alert('Funcionalidad de Edición')">✏️</button>
                        <button onclick="alert('Funcionalidad de Eliminación')">🗑️</button>
                    </td>
                </tr>`;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error('Error al listar clientes:', error);
        alert('Hubo un error al cargar los clientes.');
    }
}

async function registrarCliente(e) {
    e.preventDefault();

    const form = e.target;
    
    // El modelo Cliente tiene campos: nombre, email, telefono, direccion
    const nuevoCliente = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        direccion: document.getElementById('direccion').value.trim() 
    };
    
    // Limpieza de datos vacíos para no enviar strings vacíos si no son obligatorios
    if (nuevoCliente.telefono === '') delete nuevoCliente.telefono;
    if (nuevoCliente.direccion === '') delete nuevoCliente.direccion;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCliente)
        });

        const data = await res.json();
        
        if (res.ok) {
            alert('✅ Cliente registrado con éxito (ID: ' + data.id + ')');
            form.reset(); // Limpiar el formulario
            listarClientes(); // Actualizar la tabla
        } else if (res.status === 400 && data.error && data.error.includes('Validation error')) {
            // Manejo de error de email duplicado de Sequelize
            alert('❌ Error: El correo electrónico ya está registrado.');
        } else {
            // Otros errores 400 o 500
            throw new Error(data.error || 'Error desconocido al registrar cliente.');
        }
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        alert('❌ Error: ' + error.message);
    }
}