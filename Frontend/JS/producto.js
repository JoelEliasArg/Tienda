// producto.js
// Rutas de API
const API_PRODUCTO = 'http://localhost:3000/productos'; // Corregido: 'producto' -> 'productos'
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
    select.innerHTML = '<option value="">Cargando proveedores...</option>'; // Mensaje de carga

    try {
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

// --- 2. Listar Productos (Incluye información del Proveedor) ---

async function listarProductos() {
    try {
        const tabla = document.getElementById('tablaProductos');
        tabla.innerHTML = '<tr><td colspan="7">Cargando inventario...</td></tr>';
        
        // El controlador de productos incluye el objeto Proveedor
        const res = await fetch(API_PRODUCTO); 
        if (!res.ok) throw new Error('Error al listar productos.');

        const productos = await res.json();
        tabla.innerHTML = ''; // Limpiar después de cargar

        if (productos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="7">No hay productos en el inventario.</td></tr>';
            return;
        }

        productos.forEach(prod => {
            // Accedemos a la propiedad anidada: prod.Proveedor.nombre
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
                        <button onclick="alert('Editar Producto ${prod.id}')">✏️</button>
                        <button onclick="alert('Eliminar Producto ${prod.id}')">🗑️</button>
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