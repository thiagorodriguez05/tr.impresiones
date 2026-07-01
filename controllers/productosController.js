const pool = require("../config/db");
console.log("USANDO PRODUCTOS CONTROLLER NUEVO");

// ======================
// LISTAR PRODUCTOS
// ======================

async function listarProductos(req, res) {

    try {

        const productos = await pool.query(`
            SELECT *
            FROM productos
            ORDER BY id DESC
        `);

        const imagenes = await pool.query(`
            SELECT *
            FROM imagenes_producto
        `);

        console.log(productos.rows);
        console.log(imagenes.rows);

        const resultado = productos.rows.map(producto => {

            const fotos = imagenes.rows
                .filter(img => img.producto_id == producto.id)
                .map(img => img.imagen);

            return {
                ...producto,
                imagenes: fotos
            };

        });

        res.json(resultado);

    } catch (error) {

    console.error("==============");
    console.dir(error, { depth: null });
    console.error("==============");

    res.status(500).json({
        error: error.message
    });

}

}

// ======================
// OBTENER PRODUCTO
// ======================

async function obtenerProducto(req, res) {

    try {

        const resultado = await pool.query(
            `
            SELECT *
            FROM productos
            WHERE id = $1
            `,
            [req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }

        const producto = resultado.rows[0];

        const imagenes = await pool.query(
            `
            SELECT imagen
            FROM imagenes_producto
            WHERE producto_id = $1
            `,
            [producto.id]
        );

        producto.imagenes = imagenes.rows.map(i => i.imagen);

        res.json(producto);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}

// ======================
// AGREGAR PRODUCTO
// ======================

async function agregarProducto(req, res) {

    try {

        const {
            nombre,
            descripcion,
            precio,
            categoria,
            stock,
            imagenes
        } = req.body;

        const resultado = await pool.query(
            `
            INSERT INTO productos
            (
                nombre,
                descripcion,
                precio,
                categoria,
                stock
            )
            VALUES
            (
                $1,$2,$3,$4,$5
            )
            RETURNING id
            `,
            [
                nombre,
                descripcion,
                precio,
                categoria,
                stock
            ]
        );

        const productoId = resultado.rows[0].id;

        if (imagenes && imagenes.length > 0) {

            for (const img of imagenes) {

                await pool.query(
                    `
                    INSERT INTO imagenes_producto
                    (
                        producto_id,
                        imagen
                    )
                    VALUES
                    (
                        $1,$2
                    )
                    `,
                    [
                        productoId,
                        img.ruta
                    ]
                );

            }

        }

        res.json({
            mensaje: "Producto agregado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}

// ======================
// EDITAR PRODUCTO
// ======================

async function editarProducto(req, res) {
    console.log("ENTRÓ A EDITAR");
    console.log(req.params.id);
    console.log(req.body);

    try {

        const id = req.params.id;

        const {
            nombre,
            descripcion,
            precio,
            categoria,
            stock,
            imagenes
        } = req.body;

        // Actualizar producto
        await pool.query(
            `
            UPDATE productos
            SET
                nombre = $1,
                descripcion = $2,
                precio = $3,
                categoria = $4,
                stock = $5
            WHERE id = $6
            `,
            [
                nombre,
                descripcion,
                precio,
                categoria,
                stock,
                id
            ]
        );

        // Si llegan imágenes nuevas
        if (imagenes && imagenes.length > 0) {

            // Borra las imágenes viejas
            await pool.query(
                `
                DELETE FROM imagenes_producto
                WHERE producto_id = $1
                `,
                [id]
            );

            // Guarda las nuevas
            for (const img of imagenes) {

                await pool.query(
                    `
                    INSERT INTO imagenes_producto
                    (
                        producto_id,
                        imagen
                    )
                    VALUES
                    (
                        $1,
                        $2
                    )
                    `,
                    [
                        id,
                        img.ruta
                    ]
                );

            }

        }

        res.json({
            mensaje: "Producto actualizado correctamente"
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}


// ======================
// ELIMINAR PRODUCTO
// ======================

async function eliminarProducto(req, res) {

    try {

        const id = req.params.id;

        console.log("ELIMINANDO:", id);

        const borrarImagenes = await pool.query(
            `
            DELETE FROM imagenes_producto
            WHERE producto_id = $1
            RETURNING *;
            `,
            [id]
        );

        console.log("Imagenes eliminadas:");
        console.log(borrarImagenes.rows);

        const borrarProducto = await pool.query(
            `
            DELETE FROM productos
            WHERE id = $1
            RETURNING *;
            `,
            [id]
        );

        console.log("Producto eliminado:");
        console.log(borrarProducto.rows);

        res.json({
            mensaje: "Producto eliminado"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}

module.exports = {
    listarProductos,
    obtenerProducto,
    agregarProducto,
    editarProducto,
    eliminarProducto
};