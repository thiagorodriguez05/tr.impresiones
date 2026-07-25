const pool = require("../config/db");

// ======================
// LISTAR PEDIDOS
// ======================

async function listarPedidos(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT

            p.id,
            c.nombre,
            p.fecha,
            p.total,
            p.estado

            FROM pedidos p

            INNER JOIN clientes c
            ON c.id = p.cliente_id

            ORDER BY p.id DESC;
                `);

        res.json(resultado.rows);

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}

// ======================
// OBTENER PEDIDO
// ======================

async function obtenerPedido(req, res) {

    try {

        const { id } = req.params;

        // Pedido + Cliente
        const pedido = await pool.query(
            `
            SELECT

                p.id,
                p.fecha,
                p.estado,
                p.total,
                p.observaciones,

                c.id AS cliente_id,
                c.nombre,
                c.telefono,
                c.email,
                c.direccion

            FROM pedidos p

            INNER JOIN clientes c
                ON c.id = p.cliente_id

            WHERE p.id = $1
            `,
            [id]
        );

        if (pedido.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Pedido no encontrado"
            });

        }

        // Productos del pedido

        const detalle = await pool.query(
            `
            SELECT

                dp.producto_id,
                dp.cantidad,
                dp.precio,

                pr.nombre

            FROM detalle_pedido dp

            INNER JOIN productos pr
                ON pr.id = dp.producto_id

            WHERE dp.pedido_id = $1
            `,
            [id]
        );

        res.json({

            ...pedido.rows[0],

            productos: detalle.rows

        });

    }
    catch(error){

        console.error(error);

        res.status(500).json({

            error:error.message

        });

    }

}

// ======================
// AGREGAR PEDIDO
// ======================

async function agregarPedido(req, res) {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const {
            cliente,
            productos,
            estado,
            observaciones,
            total
        } = req.body;

        // Buscar cliente por teléfono
        let resultado = await client.query(
            `
            SELECT id
            FROM clientes
            WHERE telefono = $1
            `,
            [cliente.telefono]
        );

        let clienteId;

        if (resultado.rows.length === 0) {

            resultado = await client.query(
                `
                INSERT INTO clientes
                (
                    nombre,
                    telefono,
                    email,
                    direccion
                )
                VALUES
                (
                    $1,$2,$3,$4
                )
                RETURNING id
                `,
                [
                    cliente.nombre,
                    cliente.telefono,
                    cliente.email,
                    cliente.direccion
                ]
            );

        }

        clienteId = resultado.rows[0].id;

        // Crear pedido

        resultado = await client.query(
            `
            INSERT INTO pedidos
            (
                cliente_id,
                estado,
                total,
                observaciones
            )
            VALUES
            (
                $1,$2,$3,$4
            )
            RETURNING id
            `,
            [
                clienteId,
                estado,
                total,
                observaciones
            ]
        );

        const pedidoId = resultado.rows[0].id;

        // Guardar detalle

        for (const producto of productos) {

            await client.query(
                `
                INSERT INTO detalle_pedido
                (
                    pedido_id,
                    producto_id,
                    cantidad,
                    precio
                )
                VALUES
                (
                    $1,$2,$3,$4
                )
                `,
                [
                    pedidoId,
                    producto.producto_id,
                    producto.cantidad,
                    producto.precio
                ]
            );

        }

        await client.query("COMMIT");

        res.json({

            mensaje: "Pedido creado correctamente"

        });

    }
    catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }
    finally {

        client.release();

    }

}

// ======================
// EDITAR PEDIDO
// ======================

// ======================
// EDITAR PEDIDO
// ======================

async function editarPedido(req, res) {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const { id } = req.params;

        const {
            cliente,
            productos,
            estado,
            observaciones,
            total
        } = req.body;

        // Buscar el cliente del pedido

        const pedido = await client.query(
            `
            SELECT cliente_id
            FROM pedidos
            WHERE id = $1
            `,
            [id]
        );

        if (pedido.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                mensaje: "Pedido no encontrado"
            });

        }

        const clienteId = pedido.rows[0].cliente_id;

        // Actualizar cliente

        await client.query(
            `
            UPDATE clientes
            SET
                nombre = $1,
                telefono = $2,
                email = $3,
                direccion = $4
            WHERE id = $5
            `,
            [
                cliente.nombre,
                cliente.telefono,
                cliente.email,
                cliente.direccion,
                clienteId
            ]
        );

        // Actualizar pedido

        await client.query(
            `
            UPDATE pedidos
            SET
                estado = $1,
                observaciones = $2,
                total = $3
            WHERE id = $4
            `,
            [
                estado,
                observaciones,
                total,
                id
            ]
        );

        // Borrar detalle anterior

        await client.query(
            `
            DELETE FROM detalle_pedido
            WHERE pedido_id = $1
            `,
            [id]
        );

        // Insertar detalle nuevo

        for (const producto of productos) {

            await client.query(
                `
                INSERT INTO detalle_pedido
                (
                    pedido_id,
                    producto_id,
                    cantidad,
                    precio
                )
                VALUES
                (
                    $1,$2,$3,$4
                )
                `,
                [
                    id,
                    producto.producto_id,
                    producto.cantidad,
                    producto.precio
                ]
            );

        }

        await client.query("COMMIT");

        res.json({

            mensaje: "Pedido actualizado correctamente"

        });

    }
    catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }
    finally {

        client.release();

    }

}

// ======================
// ELIMINAR PEDIDO
// ======================

async function eliminarPedido(req, res) {

    try {

        await pool.query(
            `
            DELETE FROM pedidos
            WHERE id = $1
            `,
            [req.params.id]
        );

        res.json({
            mensaje: "Pedido eliminado correctamente"
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}

// ====================================
// CAMBIAR ESTADO
// ====================================

// ====================================
// CAMBIAR ESTADO
// ====================================

async function cambiarEstadoPedido(req, res) {

    try {

        const { id } = req.params;

        await pool.query(
            `
            UPDATE pedidos
            SET estado = 'Entregado'
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            mensaje: "Pedido entregado correctamente"
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}

module.exports = {

    listarPedidos,
    obtenerPedido,
    agregarPedido,
    editarPedido,
    eliminarPedido,
    cambiarEstadoPedido

};