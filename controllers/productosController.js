const { sql, getConnection } = require("../config/db");

// ======================
// LISTAR PRODUCTOS
// ======================

async function listarProductos(req, res) {

    try {

        console.log("ENTRO AL CONTROLLER SQL");

        const conexion = await getConnection();

        const resultado = await conexion
            .request()
            .query("SELECT * FROM productos");

        console.log(resultado.recordset);

        const productos = resultado.recordset.map(p => ({
            ...p,
            imagenes: [p.imagen]
        }));

        res.json(productos);

    } catch (error) {
        console.error(error);
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

            producto.imagenes = [producto.imagen];

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

        const conexion = await getConnection();

        await conexion
            .request()

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
                sql.Decimal(10,2),
                req.body.precio
            )

            .input(
                "categoria",
                sql.VarChar,
                req.body.categoria
            )

            .input(
                "imagen",
                sql.VarChar,
                req.body.imagen
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
                    imagen,
                    stock
                )

                VALUES
                (
                    @nombre,
                    @descripcion,
                    @precio,
                    @categoria,
                    @imagen,
                    @stock
                )
            `);

        res.json({
            mensaje: "Producto agregado"
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

    try {

        const conexion = await getConnection();

        await conexion
            .request()

            .input(
                "id",
                sql.Int,
                req.params.id
            )

            .input(
                "precio",
                sql.Decimal(10,2),
                req.body.precio
            )

            .input(
                "stock",
                sql.Int,
                req.body.stock
            )

            .input(
                "descripcion",
                sql.NVarChar(sql.MAX),
                req.body.descripcion
            )

            .query(`
                UPDATE productos

                SET

                precio=@precio,
                stock=@stock,
                descripcion=@descripcion

                WHERE id=@id
            `);

        res.json({
            mensaje: "Producto actualizado"
        });

    } catch (error) {

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