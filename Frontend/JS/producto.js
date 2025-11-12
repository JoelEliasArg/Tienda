// producto.js
// Rutas de API
const API_PRODUCTO = 'http://localhost:3000/productos'; 
const API_PROVEEDOR = 'http://localhost:3000/proveedores';

document.addEventListener('DOMContentLoaded', () => {
    cargarProveedores(); // Cargar la lista de proveedores al iniciar
    
    // Vinculación de formulario y botón
    document.getElementById('formProducto').addEventListener('submit', registrarProducto);
    document.getElementById('btnListarProductos').addEventListener('click', listarProductos);
});

// --- 1. Llenar el Selector de Proveedores ---

async function cargarProveedores() {
    const select = document.getElementById('proveedorId');
    select.innerHTML = '<option value="">Cargando proveedores...</option>';

    try {
        // NOTA: Se asume que esta ruta también trae solo proveedores activos si es necesario.
        const res = await fetch(API_PROVEEDOR); 
        if (!res.ok) throw new Error('Error al cargar proveedores.');

        const proveedores = await res.json();
        
        // Limpiar el select
        select.innerHTML = '<option value="">-- Seleccionar proveedor --</option>';

        proveedores.forEach(prov => {
            const option = document.createElement('option');
            option.value = prov.id;
            option.textContent = prov.nombre;
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar proveedores:', error);
        select.innerHTML = '<option value="">Error al cargar (Ver consola)</option>';
    }
}

// --- 2. Listar Productos (Filtrando solo Activos) ---

async function listarProductos() {
    try {
        const tabla = document.getElementById('tablaProductos');
        tabla.innerHTML = '<tr><td colspan="7">Cargando inventario...</td></tr>';
        
        // 🔑 CLAVE: Fetch de datos, solicitando solo los activos (activo=1)
        const res = await fetch(`${API_PRODUCTO}?activo=1`); 
        if (!res.ok) throw new Error('Error al listar productos activos.');

        const productos = await res.json();
        tabla.innerHTML = ''; // Limpiar después de cargar

        if (productos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="7">No hay productos activos en el inventario.</td></tr>';
            return;
        }

        productos.forEach(prod => {
            // Accedemos a la propiedad anidada: prod.Proveedor.nombre (asumiendo include en el backend)
            const nombreProveedor = prod.Proveedor ? prod.Proveedor.nombre : 'Sin Proveedor';

            const fila = `
                <tr>
                    <td>${prod.id}</td>
                    <td>${prod.nombre}</td>
                    <td>${prod.descripcion || '—'}</td>
                    <td>$${prod.precio.toFixed(2)}</td>
                    <td>${prod.stock}</td>
                    <td>${nombreProveedor}</td>
                    <td>
                        <button onclick="editarProducto(${prod.id}, '${prod.nombre.replace(/'/g, "\\'")}', ${prod.precio}, ${prod.stock}, ${prod.proveedorId})">✏️ Editar</button>
                        <button onclick="eliminarProducto(${prod.id})">🗑️ Desactivar</button> 
                    </td>
                </tr>`;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error('Error al listar productos:', error);
        alert('Hubo un error al cargar los productos: ' + error.message);
    }
}

// --- 3. Registrar Producto ---

async function registrarProducto(e) {
    e.preventDefault();

    const form = e.target;
    
    const nuevoProducto = {
        nombre: document.getElementById('nombre').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        // Valor del select es el ID del proveedor
        proveedorId: parseInt(document.getElementById('proveedorId').value) 
    };

    // Validaciones extra para números
    if (isNaN(nuevoProducto.precio) || isNaN(nuevoProducto.stock)) {
          return alert("El precio y el stock deben ser números válidos.");
    }
    
    // Si la descripción está vacía, no la enviamos
    if (nuevoProducto.descripcion === '') delete nuevoProducto.descripcion;

    try {
        const res = await fetch(API_PRODUCTO, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProducto)
        });

        const data = await res.json();
        
        if (res.ok) {
            alert(`✅ Producto '${data.nombre}' registrado con éxito.`);
            form.reset(); 
            listarProductos(); // Actualizar la tabla
        } else {
            // Manejo de errores de Sequelize (ej. proveedorId inexistente)
            throw new Error(data.error || 'Error desconocido al registrar producto.');
        }
    } catch (error) {
        console.error('Error al registrar producto:', error);
        alert('❌ Error: ' + error.message);
    }
}

// --- 4. Funcionalidad de Eliminación (Soft Delete: PUT activo = 0) ---

async function eliminarProducto(id) {
    if (!confirm(`⚠️ ¿Está seguro que desea DESACTIVAR el Producto con ID ${id}? Será ocultado del inventario.`)) {
        return;
    }

    try {
        const res = await fetch(`${API_PRODUCTO}/${id}`, {
            method: 'PUT', // 🔑 CLAVE: Usamos PUT para el Soft Delete
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: 0 }) // 🔑 CLAVE: Enviamos el campo activo a 0
        });

        if (res.ok) {
            alert('🗑️ Producto DESACTIVADO con éxito.');
            listarProductos(); // Refrescar la tabla
        } else {
            const data = await res.json();
            throw new Error(data.error || 'No se pudo desactivar el producto.');
        }
    } catch (error) {
        console.error('Error al desactivar producto:', error);
        alert('❌ Error al desactivar: ' + error.message);
    }
}


// --- 5. Funcionalidad de Edición (Función Placeholder) ---

async function editarProducto(id, nombreActual, precioActual, stockActual, proveedorIdActual) {
    
    // 1. Recolección de nuevos datos
    const nuevoNombre = prompt(`Editando Producto ID ${id}.\nIngrese el nuevo nombre:`, nombreActual);
    if (nuevoNombre === null || nuevoNombre.trim() === '') return;

    // Nota: Para Precio y Stock usamos prompt y luego validamos el número.
    const nuevoPrecioStr = prompt(`Ingrese el nuevo precio:`, precioActual);
    if (nuevoPrecioStr === null) return;
    const nuevoPrecio = parseFloat(nuevoPrecioStr);

    const nuevoStockStr = prompt(`Ingrese el nuevo stock:`, stockActual);
    if (nuevoStockStr === null) return;
    const nuevoStock = parseInt(nuevoStockStr);

    // Simplificación: Asumimos que no vamos a cambiar el proveedorId en esta versión rápida. 
    // Si quieres cambiar el proveedor, necesitarías un selector más complejo que prompt.
    const nuevoProveedorId = proveedorIdActual; 

    // 2. Validación de datos numéricos
    if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
        return alert("El precio ingresado no es un número válido o es negativo.");
    }
    if (isNaN(nuevoStock) || nuevoStock < 0) {
        return alert("El stock ingresado no es un número válido o es negativo.");
    }

    // 3. Construir el objeto de actualización
    const productoActualizado = {
        nombre: nuevoNombre.trim(),
        precio: nuevoPrecio,
        stock: nuevoStock,
        proveedorId: nuevoProveedorId // Se mantiene el proveedor actual
        // Si tienes campo 'descripcion' en el formulario, agrégalo aquí también.
    };

    try {
        const res = await fetch(`${API_PRODUCTO}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productoActualizado)
        });

        if (res.ok) {
            alert('✅ Producto actualizado con éxito.');
            listarProductos(); // Refrescar la tabla para ver los cambios
        } else {
            const data = await res.json();
            throw new Error(data.error || 'No se pudo actualizar el producto.');
        }
    } catch (error) {
        console.error('Error al editar producto:', error);
        alert('❌ Error al actualizar: ' + error.message);
    }
}