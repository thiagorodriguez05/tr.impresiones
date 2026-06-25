const { getConnection } = require("../config/db");

// ======================
// LISTAR CATEGORÍAS
// ======================

async function listarCategorias(req, res) {

    try {

        const conexion = await getConnection();

        const resultado = await conexion
            .request()
            .query(`
                SELECT *
                FROM categorias
                ORDER BY nombre
            `);

        res.json(resultado.recordset);

    }
    catch(error){

        console.error(error);

        res.status(500).json({
            error:error.message
        });

    }

}

module.exports = {

    listarCategorias

};