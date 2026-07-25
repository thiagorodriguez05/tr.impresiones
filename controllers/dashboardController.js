const pool = require("../config/db");

async function obtenerDashboard(req, res) {

    try {

        const ventas = await pool.query(`
            SELECT COALESCE(SUM(total),0) AS ventas
            FROM pedidos
            WHERE estado='Entregado'
        `);

        const pendientes = await pool.query(`
            SELECT COUNT(*) total
            FROM pedidos
            WHERE estado='Pendiente'
        `);

        const entregados = await pool.query(`
            SELECT COUNT(*) total
            FROM pedidos
            WHERE estado='Entregado'
        `);

        const clientes = await pool.query(`
            SELECT COUNT(*) total
            FROM clientes
        `);

        const productos = await pool.query(`
            SELECT COUNT(*) total
            FROM productos
        `);

        res.json({

            ventas: Number(ventas.rows[0].ventas),

            pendientes: Number(pendientes.rows[0].total),

            entregados: Number(entregados.rows[0].total),

            clientes: Number(clientes.rows[0].total),

            productos: Number(productos.rows[0].total)

        });

    }
    catch(error){

        console.error(error);

        res.status(500).json({

            error:error.message

        });

    }

}

module.exports={

    obtenerDashboard

};