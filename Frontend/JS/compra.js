// compra.js
const API_COMPRA = 'http://localhost:3000/compras';
const API_CLIENTE = 'http://localhost:3000/clientes';
const API_PRODUCTO = 'http://localhost:3000/productos';

let carrito = [];
let productosDisponibles = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales();
    
    // Vinculación de formularios
    document.getElementById('formAnadirProducto').addEventListener('submit', agregarProductoAlCarrito);
    document.getElementById('formCompra').addEventListener('submit', registrarCompra);
    document.getElementById('btnListarCompras').addEventListener('click', listarCompras);
});

// --- Carga de Datos Iniciales (Clientes y Productos) ---

async function cargarDatosIniciales() {
    // 1. Cargar Clientes
    const selectCliente = document.getElementById('clienteId');
    try {
        const resClientes = await fetch(API_CLIENTE);
        const clientes = await resClientes.json();
        
        selectCliente.innerHTML = '<option value="">-- Seleccionar cliente --</option>';
        clientes.forEach(c => {
            selectCliente.innerHTML += `<option value="${c.id}">${c.nombre} (${c.email})</option>`;
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        selectCliente.innerHTML = '<option value="">Error al cargar clientes</option>';
    }

    // 2. Cargar Productos
    const selectProducto = document.getElementById('productoSeleccionado');
    try {
        const resProductos = await fetch(API_PRODUCTO);
        productosDisponibles = await resProductos.json();
        
        selectProducto.innerHTML = '<option value="">-- Seleccionar producto --</option>';
        productosDisponibles.forEach(p => {
            selectProducto.innerHTML += `<option value="${p.id}">${p.nombre} ($${p.precio.toFixed(2)})</option>`;
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        selectProducto.innerHTML = '<option value="">Error al cargar productos</option>';
    }
}

// --- Lógica del Carrito ---

function agregarProductoAlCarrito(e) {
    e.preventDefault();

    const productoId = parseInt(document.getElementById('productoSeleccionado').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);

    if (!productoId || cantidad <= 0) return alert("Selecciona un producto y cantidad válida.");

    const productoData = productosDisponibles.find(p => p.id === productoId);

    if (!productoData) return alert("Producto no encontrado.");
    
    // El precio se toma del productoData, NO del input (seguridad)
    const precioUnitario = productoData.precio;
    const subtotal = precioUnitario * cantidad;

    const itemExistenteIndex = carrito.findIndex(item => item.productoId === productoId);

    if (itemExistenteIndex > -1) {
        // Si ya existe, actualiza la cantidad
        carrito[itemExistenteIndex].cantidad += cantidad;
        carrito[itemExistenteIndex].subtotal += subtotal;
    } else {
        // Si es nuevo, añade el ítem al carrito
        carrito.push({
            productoId,
            nombre: productoData.nombre,
            precioUnitario,
            cantidad,
            subtotal
        });
    }

    renderizarCarrito();
}

function quitarProductoDelCarrito(productoId) {
    carrito = carrito.filter(item => item.productoId !== productoId);
    renderizarCarrito();
}

function renderizarCarrito() {
    const tabla = document.getElementById('tablaCarrito');
    const totalDisplay = document.getElementById('totalCompra');
    const btnRegistrar = document.getElementById('btnRegistrarCompra');
    
    tabla.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5">El carrito está vacío.</td></tr>';
        btnRegistrar.disabled = true;
    } else {
        carrito.forEach((item, index) => {
            total += item.subtotal;
            const fila = `
                <tr>
                    <td>${item.nombre}</td>
                    <td>$${item.precioUnitario.toFixed(2)}</td>
                    <td>${item.cantidad}</td>
                    <td>$${item.subtotal.toFixed(2)}</td>
                    <td><button onclick="quitarProductoDelCarrito(${item.productoId})">🗑️</button></td>
                </tr>`;
            tabla.innerHTML += fila;
        });
        btnRegistrar.disabled = false;
    }

    totalDisplay.textContent = `$${total.toFixed(2)}`;
    btnRegistrar.textContent = `Registrar Compra ($${total.toFixed(2)})`;
}

// --- Registrar Compra (Envía Cabecera + Detalles) ---

async function registrarCompra(e) {
    e.preventDefault();

    const clienteId = parseInt(document.getElementById('clienteId').value);

    if (!clienteId || carrito.length === 0) {
        return alert("Debe seleccionar un cliente y añadir al menos un producto.");
    }

    // Mapear el carrito al formato esperado por el controlador (clienteId + array de productos)
    const productosPayload = carrito.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario // Usamos el precio del carrito
    }));

    const payload = {
        clienteId: clienteId,
        productos: productosPayload // El controlador calculará el TOTAL a partir de esto
    };

    try {
        const res = await fetch(API_COMPRA, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if (res.ok) {
            alert(`✅ Compra registrada con éxito (ID: ${data.compra.id})`);
            carrito = []; // Vaciar carrito
            renderizarCarrito();
            listarCompras(); // Actualizar el historial
        } else {
            throw new Error(data.error || 'Error desconocido al registrar la compra.');
        }
    } catch (error) {
        console.error('Error al registrar compra:', error);
        alert('❌ Error al registrar compra: ' + error.message);
    }
}

// --- Listar Compras (Historial) ---

async function listarCompras() {
    try {
        const tabla = document.getElementById('tablaComprasHistorial');
        tabla.innerHTML = '<tr><td colspan="5">Cargando historial...</td></tr>';
        
        // El controlador de compras incluye el objeto Cliente
        const res = await fetch(API_COMPRA); 
        if (!res.ok) throw new Error('Error al listar compras.');

        const data = await res.json();
        tabla.innerHTML = '';
        
        if (data.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5">No hay compras en el historial.</td></tr>';
            return;
        }

        data.forEach(c => {
            // Accedemos a la propiedad anidada: c.Cliente.nombre
            const nombreCliente = c.Cliente ? c.Cliente.nombre : 'Cliente Desconocido';
            const fechaFormateada = new Date(c.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

            const fila = `
                <tr>
                    <td>${c.id}</td>
                    <td>${nombreCliente}</td>
                    <td>$${c.total.toFixed(2)}</td>
                    <td>${fechaFormateada}</td>
                    <td>
                        <button onclick="alert('Ver detalle de compra ID ${c.id}')">Ver Detalle</button>
                    </td>
                </tr>`;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error('Error al listar compras:', error);
        alert('Hubo un error al cargar el historial de compras: ' + error.message);
    }
}