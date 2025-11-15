const { Compra, Cliente, Producto, CompraProducto } = require('../baseDatos');

module.exports = {
    async crearCompra(req, res) {
        try {
            const { clienteId, productos } = req.body;
            
            if (!productos || !Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ error: 'Debe incluir una lista de productos' });
            }

            // 1. Calcular total
            const total = productos.reduce((sum, p) => sum + (p.precioUnitario * p.cantidad), 0);
            
            // 2. Crear la cabecera de la compra
            const compra = await Compra.create({ clienteId, total });

            // 3. Crear detalles en CompraProducto y ACTUALIZAR STOCK
            for (const p of productos) {
                // Registrar el detalle
                await CompraProducto.create({
                    compraId: compra.id,
                    productoId: p.productoId,
                    cantidad: p.cantidad,
                    precioUnitario: p.precioUnitario,
                    subtotal: p.cantidad * p.precioUnitario
                });

                // 🔑 CLAVE: Descontar el stock
                const producto = await Producto.findByPk(p.productoId);
                
                if (producto) {
                    const nuevaCantidad = producto.stock - p.cantidad;
                    
                    // Opcional: Validación de stock
                    if (nuevaCantidad < 0) {
                        // En un sistema real, aquí se revertiría toda la transacción.
                        // Para este ejemplo, lanzamos un error claro.
                        throw new Error(`Stock insuficiente para el producto: ${producto.nombre}.`);
                    }

                    // Actualizar el stock en la base de datos
                    await producto.update({ stock: nuevaCantidad });
                }
            }

            res.status(201).json({ mensaje: 'Compra registrada', compra });
        } catch (error) {
            console.error('Error al crear compra:', error);
            // Devolvemos el error con código 400 o 500 si es un fallo interno
            res.status(400).json({ error: error.message || 'Error interno al registrar la compra.' });
        }
    },
    
    // --- FUNCIÓN PARA VER DETALLE (Corregida) ---
    async obtenerDetalleCompra(req, res) {
        try {
            const compraId = req.params.id;

            const compra = await Compra.findByPk(compraId, {
                // Incluimos al Cliente
                include: [
                    { 
                        model: Cliente, 
                        attributes: ['nombre'] 
                    },
                    // Usamos el modelo COMPRAPRODUCTO (tabla de detalles)
                    {
                        model: CompraProducto, 
                        // Incluimos el Producto asociado
                        include: [
                            { 
                                model: Producto, 
                                attributes: ['nombre'] 
                            }
                        ]
                    }
                ]
            });

            if (!compra) {
                return res.status(404).json({ error: 'Compra no encontrada.' });
            }

            res.json(compra);
        } catch (error) {
            console.error('Error al obtener detalle de compra:', error);
            res.status(500).json({ error: 'Error interno al obtener el detalle de la compra.' });
        }
    },
    
    // --- FUNCIÓN PARA LISTAR COMPRAS ---
    async obtenerCompras(req, res) {
        try {
            const compras = await Compra.findAll({
                include: [
                    { model: Cliente },
                    // Nota: Si solo quieres la lista, no necesitas incluir { model: Producto } aquí
                ]
            });
            res.json(compras);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // --- FUNCIÓN PARA OBTENER COMPRA POR ID (Si la usas, es redundante con obtenerDetalleCompra) ---
    async obtenerCompraPorId(req, res) {
        try {
            const compra = await Compra.findByPk(req.params.id, {
                include: [
                    { model: Cliente },
                    { model: Producto } 
                    // Si esta ruta se llama /compras/:id, debería ser igual a obtenerDetalleCompra
                ]
            });
            if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
            res.json(compra);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};