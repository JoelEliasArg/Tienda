// proveedor.js
const API_URL = 'http://localhost:3000/proveedores'; 

document.addEventListener('DOMContentLoaded', () => {
  // Vinculación del formulario de registro
  document.getElementById('formProveedor').addEventListener('submit', registrarProveedor);

  // Vinculación del botón para listar proveedores
  document.getElementById('btnListarProveedores').addEventListener('click', listarProveedores);
});

// --- Funciones de Consumo de API (CRUD) ---

async function listarProveedores() {
  try {
    const tabla = document.getElementById('tablaProveedores'); 

    // 1. Fetch de datos, solicitando solo los activos (activo=1)
    // El backend debe estar configurado para filtrar por el query 'activo=1' y ordenar por nombre.
    const res = await fetch(`${API_URL}?activo=1`);
    if (!res.ok) throw new Error('Error al obtener la lista de proveedores activos: ' + res.statusText);
    
    const data = await res.json();

    // 2. Limpiar y renderizar tabla
    tabla.innerHTML = '';

    if (data.length === 0) {
      tabla.innerHTML = '<tr><td colspan="8">No hay proveedores activos registrados.</td></tr>';
      return;
    }

    data.forEach(prov => {
      // Aseguramos que los strings pasados a la función no tengan comillas simples que rompan el JS
      const nombre = prov.nombre.replace(/'/g, "\\'");
      const contacto = prov.contacto ? prov.contacto.replace(/'/g, "\\'") : '';
      const telefono = prov.telefono || '';
      const email = prov.email || '';
      const direccion = prov.direccion ? prov.direccion.replace(/'/g, "\\'") : '';

      const fila = `
        <tr>
          <td>${prov.id}</td>
          <td>${nombre}</td>
          <td>${contacto || 'N/A'}</td>
          <td>${telefono || 'N/A'}</td>
          <td>${email || 'N/A'}</td>
          <td>${direccion || 'N/A'}</td>
          <td>
            <button onclick="editarProveedor(${prov.id}, '${nombre}', '${contacto}', '${telefono}', '${email}', '${direccion}')">✏️ Editar</button>
            <button onclick="eliminarProveedor(${prov.id})">🗑️ Desactivar</button>
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
  
  // Limpieza de datos vacíos para enviar null a la DB o no enviarlos
  Object.keys(nuevoProveedor).forEach(key => {
    if (nuevoProveedor[key] === '') {
      nuevoProveedor[key] = null; // Usar null para campos opcionales en Sequelize
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

async function editarProveedor(id, nombreActual, contactoActual, telefonoActual, emailActual, direccionActual) {
  // 1. Pedir nuevos datos usando prompt (simplificado)
  const nuevoNombre = prompt(`Editando Proveedor ID ${id}.\nIngrese el nuevo nombre:`, nombreActual);
  if (nuevoNombre === null || nuevoNombre.trim() === '') return;

  const nuevoContacto = prompt(`Ingrese el nuevo nombre de contacto:`, contactoActual) || '';
  const nuevoTelefono = prompt(`Ingrese el nuevo teléfono:`, telefonoActual) || '';
  const nuevoEmail = prompt(`Ingrese el nuevo email:`, emailActual);
  if (nuevoEmail === null || nuevoEmail.trim() === '') return;

  const nuevaDireccion = prompt(`Ingrese la nueva dirección:`, direccionActual) || '';

  // 2. Construir el objeto de actualización
  const proveedorActualizado = {
    nombre: nuevoNombre.trim(),
    contacto: nuevoContacto.trim() || null,
    telefono: nuevoTelefono.trim() || null,
    email: nuevoEmail.trim(),
    direccion: nuevaDireccion.trim() || null
  };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proveedorActualizado)
    });

    if (res.ok) {
      alert('✅ Proveedor actualizado con éxito.');
      listarProveedores(); // Refrescar la tabla
    } else {
      const data = await res.json();
      throw new Error(data.error || 'No se pudo actualizar el proveedor.');
    }
  } catch (error) {
    console.error('Error al editar proveedor:', error);
    alert('❌ Error al actualizar: ' + error.message);
  }
}


// --- Funcionalidad de Eliminación (Soft Delete: PUT activo = 0) ---
async function eliminarProveedor(id) {
  if (!confirm(`⚠️ ¿Está seguro que desea DESACTIVAR al Proveedor con ID ${id}? Será ocultado de la lista.`)) {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT', // Usamos PUT para actualizar
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: 0 }) // Enviamos el campo activo a 0
    });

    if (res.ok) {
      alert('🗑️ Proveedor DESACTIVADO con éxito.');
      listarProveedores(); // Refrescar la tabla
    } else {
      const data = await res.json();
      throw new Error(data.error || 'No se pudo desactivar el proveedor.');
    }
  } catch (error) {
    console.error('Error al desactivar proveedor:', error);
    alert('❌ Error al desactivar: ' + error.message);
  }
}