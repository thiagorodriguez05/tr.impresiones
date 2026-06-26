const { sql, getConnection } = require("../config/db");

// ======================
// LISTAR PRODUCTOS
// ======================

async function listarProductos(req, res) {

    try {

        const conexion = await getConnection();

        // Obtener todos los productos
        const productos = await conexion
            .request()
            .query(`
                SELECT *
                FROM productos
                ORDER BY id DESC
            `);

        // Obtener todas las imágenes
        const imagenes = await conexion
            .request()
            .query(`
                SELECT *
                FROM imagenes_producto
            `);

        // Asociar imágenes a cada producto
        const resultado = productos.recordset.map(producto => {

            console.log("Producto:", producto.id, typeof producto.id);

            imagenes.recordset.forEach(img => {
                console.log("Imagen:", img.producto_id, typeof img.producto_id);
            });
            const fotos = imagenes.recordset
            .filter(img => img.producto_id == producto.id)
            .map(img => img.imagen);

            return {

                ...producto,

                imagenes: fotos

            };

        });

        res.json(resultado);

    }
    catch (error) {

        console.error(error);

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

        const conexion = await getConnection();

        const resultado = await conexion
            .request()
            .input(
                "id",
                sql.Int,
                req.params.id
            )
            .query(`
                SELECT *
                FROM productos
                WHERE id=@id
            `);

        if (resultado.recordset.length === 0) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }

        const producto = resultado.recordset[0];

        const imagenes = await conexion
            .request()
            .input(
                "id",
                sql.Int,
                producto.id
            )
            .query(`
                SELECT imagen
                FROM imagenes_producto
                WHERE producto_id=@id
            `);

        producto.imagenes =
            imagenes.recordset.map(i => i.imagen);

        res.json(producto);

    }
    catch (error) {

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

        const conexion = await getConnection();

        const imagenPrincipal =
            req.body.imagenes.length > 0
                ? req.body.imagenes[0].ruta
                : null;

        // Crear producto y obtener el ID generado
        const resultado = await conexion
            .request()

            .input("nombre", sql.VarChar, req.body.nombre)

            .input(
                "descripcion",
                sql.NVarChar(sql.MAX),
                req.body.descripcion
            )

            .input(
                "precio",
                sql.Decimal(10, 2),
                req.body.precio
            )

            .input(
                "categoria",
                sql.VarChar,
                req.body.categoria
            )

            .input(
                "stock",
                sql.Int,
                req.body.stock
            )

            .query(`
                INSERT INTO productos
                (
                    nombre,
                    descripcion,
                    precio,
                    categoria,
                    stock
                )

                OUTPUT INSERTED.id

                VALUES
                (
                    @nombre,
                    @descripcion,
                    @precio,
                    @categoria,
                    @stock
                )
            `);

        const productoId =
            resultado.recordset[0].id;

        // Guardar todas las imágenes
        for (const img of req.body.imagenes) {

            await conexion
                .request()

                .input(
                    "producto_id",
                    sql.Int,
                    productoId
                )

                .input(
                    "imagen",
                    sql.VarChar,
                    img.ruta
                )

                .query(`
                    INSERT INTO imagenes_producto
                    (
                        producto_id,
                        imagen
                    )

                    VALUES
                    (
                        @producto_id,
                        @imagen
                    )
                `);

        }

        res.json({

            mensaje: "Producto agregado correctamente"

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
// EDITAR PRODUCTO
// ======================

async function editarProducto(req, res) {

    try {

        const conexion = await getConnection();

        // Actualizar datos del producto
        await conexion
            .request()

            .input(
                "id",
                sql.Int,
                req.params.id
            )

            .input(
                "nombre",
                sql.VarChar,
                req.body.nombre
            )

            .input(
                "descripcion",
                sql.NVarChar(sql.MAX),
                req.body.descripcion
            )

            .input(
                "precio",
                sql.Decimal(10, 2),
                req.body.precio
            )

            .input(
                "categoria",
                sql.VarChar,
                req.body.categoria
            )

            .input(
                "stock",
                sql.Int,
                req.body.stock
            )

            .query(`
                UPDATE productos
                SET
                    nombre=@nombre,
                    descripcion=@descripcion,
                    precio=@precio,
                    categoria=@categoria,
                    stock=@stock
                WHERE id=@id
            `);

        // Si llegaron imágenes nuevas
        if (req.body.imagenes && req.body.imagenes.length > 0) {

            // Borra las imágenes anteriores
            await conexion
                .request()

                .input(
                    "id",
                    sql.Int,
                    req.params.id
                )

                .query(`
                    DELETE FROM imagenes_producto
                    WHERE producto_id=@id
                `);

            // Guarda las nuevas
            for (const img of req.body.imagenes) {

                await conexion
                    .request()

                    .input(
                        "producto_id",
                        sql.Int,
                        req.params.id
                    )

                    .input(
                        "imagen",
                        sql.VarChar,
                        img.ruta
                    )

                    .query(`
                        INSERT INTO imagenes_producto
                        (
                            producto_id,
                            imagen
                        )
                        VALUES
                        (
                            @producto_id,
                            @imagen
                        )
                    `);

            }

        }

        res.json({

            mensaje: "Producto actualizado"

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

        const conexion = await getConnection();

        await conexion
            .request()

            .input(
                "id",
                sql.Int,
                req.params.id
            )

            .query(`
                DELETE FROM productos
                WHERE id=@id
            `);

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