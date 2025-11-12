// cliente.js
const API_URL = 'http://localhost:3000/clientes'; 

document.addEventListener('DOMContentLoaded', () => {
  // Vinculación del formulario de registro
  document.getElementById('formCliente').addEventListener('submit', registrarCliente);

  // Vinculación del nuevo botón para listar clientes
  document.getElementById('btnListarClientes').addEventListener('click', listarClientes);

  // Opcional: Si quieres que la lista se cargue al inicio, descomenta la línea de abajo:
  // listarClientes();
});

// --- Funciones de Consumo de API (CRUD) ---

async function listarClientes() {
  try {
    const tabla = document.getElementById('tablaClientes'); 

    // 1. 🔑 CLAVE: Fetch de datos incluyendo el filtro 'activo=1'
    // Asumimos que el backend maneja este parámetro de filtro en la ruta GET /clientes
    const res = await fetch(`${API_URL}?activo=1`); 
    if (!res.ok) throw new Error('Error al obtener la lista de clientes activos: ' + res.statusText);
    
    // ... (El resto de la función para renderizar se mantiene igual)
    const data = await res.json();
    tabla.innerHTML = '';

    if (data.length === 0) {
      tabla.innerHTML = '<tr><td colspan="6">No hay clientes activos registrados.</td></tr>';
      return;
    }

    data.forEach(cliente => {
      // ... (Renderizado de fila se mantiene igual)
            const fila = `
        <tr>
          <td>${cliente.id}</td>
          <td>${cliente.nombre}</td>
          <td>${cliente.email}</td>
          <td>${cliente.telefono || 'N/A'}</td>
          <td>${cliente.direccion || 'N/A'}</td>
          <td>
            <button onclick="editarCliente(${cliente.id}, '${cliente.nombre}', '${cliente.email}', '${cliente.telefono || ''}', '${cliente.direccion || ''}')">✏️ Editar</button>
            <button onclick="eliminarCliente(${cliente.id})">🗑️ Desactivar</button>
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
  
  // Limpieza de datos vacíos
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
      form.reset(); 
      listarClientes(); // Actualizar la tabla
    } else if (res.status === 400 && data.error && data.error.includes('Validation error')) {
      alert('❌ Error: El correo electrónico ya está registrado.');
    } else {
      throw new Error(data.error || 'Error desconocido al registrar cliente.');
    }
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    alert('❌ Error: ' + error.message);
  }
}

// --- Funcionalidad de Edición (UPDATE/PUT) ---
async function editarCliente(id, nombreActual, emailActual, telefonoActual, direccionActual) {
    // 1. Pedir nuevos datos (simplificado con prompt)
    const nuevoNombre = prompt(`Editando cliente ID ${id}.\nIngrese el nuevo nombre:`, nombreActual);
    if (nuevoNombre === null || nuevoNombre.trim() === '') return; // Cancelado o vacío

    const nuevoEmail = prompt(`Ingrese el nuevo email:`, emailActual);
    if (nuevoEmail === null || nuevoEmail.trim() === '') return;

    const nuevoTelefono = prompt(`Ingrese el nuevo teléfono (o deje vacío):`, telefonoActual) || '';
    const nuevaDireccion = prompt(`Ingrese la nueva dirección (o deje vacío):`, direccionActual) || '';

    // 2. Construir el objeto de actualización
    const clienteActualizado = {
        nombre: nuevoNombre.trim(),
        email: nuevoEmail.trim(),
        telefono: nuevoTelefono.trim() || null, // Usar null si está vacío para la DB
        direccion: nuevaDireccion.trim() || null
    };

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteActualizado)
        });

        if (res.ok) {
            alert('✅ Cliente actualizado con éxito.');
            listarClientes(); // Refrescar la tabla
        } else {
            const data = await res.json();
            throw new Error(data.error || 'No se pudo actualizar el cliente.');
        }
    } catch (error) {
        console.error('Error al editar cliente:', error);
        alert('❌ Error al actualizar: ' + error.message);
    }
}


// --- Funcionalidad de Eliminación (DELETE) ---
async function eliminarCliente(id) {
    if (!confirm(`⚠️ ¿Está seguro que desea DESACTIVAR al cliente con ID ${id}? Será ocultado de la lista.`)) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT', // 🔑 CLAVE: Usamos PUT para actualizar
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: 0 }) // 🔑 CLAVE: Enviamos el campo activo a 0
        });

        if (res.ok) {
            alert('🗑️ Cliente DESACTIVADO con éxito.');
            listarClientes(); // Refrescar la tabla, ahora el cliente no aparecerá
        } else {
            const data = await res.json();
            throw new Error(data.error || 'No se pudo desactivar el cliente.');
        }
    } catch (error) {
        console.error('Error al desactivar cliente:', error);
        alert('❌ Error al desactivar: ' + error.message);
    }
}