const pool = require("../config/db");

// ======================
// LISTAR CATEGORÍAS
// ======================

async function listarCategorias(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT *
            FROM categorias
            ORDER BY nombre
        `);

        console.log(resultado.rows);

        res.json(resultado.rows);

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}

module.exports = {

    listarCategorias

};