const pool = require("../config/db");

// ======================
// LISTAR CATEGORÍAS
// ======================

async function listarCategorias(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT
                id,
                nombre,
                slug
            FROM categorias
            ORDER BY nombre
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
// OBTENER CATEGORÍA
// ======================

async function obtenerCategoria(req, res) {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            `
            SELECT
                id,
                nombre,
                slug
            FROM categorias
            WHERE id = $1
            `,
            [id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                error: "Categoría no encontrada"
            });

        }

        res.json(resultado.rows[0]);

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}

// ======================
// CREAR CATEGORÍA
// ======================

async function crearCategoria(req, res) {

    try {

        const { nombre, slug } = req.body;

        if (!nombre?.trim()) {

            return res.status(400).json({
                error: "El nombre es obligatorio"
            });

        }

        const existe = await pool.query(
            `
            SELECT id
            FROM categorias
            WHERE LOWER(nombre)=LOWER($1)
            `,
            [nombre]
        );

        if (existe.rows.length > 0) {

            return res.status(409).json({
                error: "La categoría ya existe"
            });

        }

        const resultado = await pool.query(
            `
            INSERT INTO categorias
            (
                nombre,
                slug
            )
            VALUES
            (
                $1,
                $2
            )
            RETURNING *
            `,
            [
                nombre,
                slug
            ]
        );

        res.status(201).json(resultado.rows[0]);

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}

// ======================
// EDITAR CATEGORÍA
// ======================

async function editarCategoria(req, res) {

    try {

        const { id } = req.params;

        const {
            nombre,
            slug
        } = req.body;

        if (!nombre?.trim()) {

            return res.status(400).json({
                error: "El nombre es obligatorio"
            });

        }

        const resultado = await pool.query(
            `
            UPDATE categorias
            SET
                nombre = $1,
                slug = $2
            WHERE id = $3
            RETURNING *
            `,
            [
                nombre,
                slug,
                id
            ]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                error: "Categoría no encontrada"
            });

        }

        res.json(resultado.rows[0]);

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}

// ======================
// ELIMINAR CATEGORÍA
// ======================

async function eliminarCategoria(req, res) {

    try {

        const { id } = req.params;

        const categoria = await pool.query(
            `
            SELECT nombre
            FROM categorias
            WHERE id = $1
            `,
            [id]
        );

        if (categoria.rows.length === 0) {

            return res.status(404).json({
                error: "Categoría no encontrada"
            });

        }

        const nombreCategoria =
            categoria.rows[0].nombre;

        const productos = await pool.query(
            `
            SELECT id
            FROM productos
            WHERE categoria = $1
            LIMIT 1
            `,
            [nombreCategoria]
        );

        if (productos.rows.length > 0) {

            return res.status(400).json({
                error: "No se puede eliminar una categoría con productos asociados"
            });

        }

        await pool.query(
            `
            DELETE FROM categorias
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            mensaje: "Categoría eliminada correctamente"
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

    listarCategorias,
    obtenerCategoria,
    crearCategoria,
    editarCategoria,
    eliminarCategoria

};