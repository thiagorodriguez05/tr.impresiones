const pool = require("../config/db");

// Obtener la configuración
const obtenerConfiguracion = async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM configuracion LIMIT 1"
        );

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener la configuración"
        });
    }
};

// Actualizar la configuración
const actualizarConfiguracion = async (req, res) => {
    const {
        precio_pla,
        precio_petg,
        precio_tpu,
        margen
    } = req.body;

    try {
        await pool.query(
        `
        UPDATE configuracion
        SET precio_pla = $1,
            precio_petg = $2,
            precio_tpu = $3,
            margen = $4
        WHERE id = 1`,
        [
            precio_pla,
            precio_petg,
            precio_tpu,
            margen
        ]
        );

        res.json({
            mensaje: "Configuración actualizada correctamente"
        });
    } catch (error) {
        console.error("ERROR CONFIGURACION:");
            console.error(error);

            res.status(500).json({
                mensaje: error.message
            });
    }
};

// Recalcular precios de todos los productos
const recalcularPrecios = async (req, res) => {

    try {

        // Obtener configuración
        const config = await pool.query(
            "SELECT * FROM configuracion LIMIT 1"
        );

        const {
            precio_pla,
            precio_petg,
            precio_tpu,
            margen
        } = config.rows[0];

        // Obtener productos
        const productos = await pool.query(
            "SELECT id, material, gramos FROM productos"
        );

        let actualizados = 0;

        for (const producto of productos.rows) {

            let precioKg = 0;

            switch ((producto.material || "").toLowerCase()) {

                case "pla":
                    precioKg = Number(precio_pla);
                    break;

                case "petg":
                    precioKg = Number(precio_petg);
                    break;

                case "tpu":
                    precioKg = Number(precio_tpu);
                    break;

                default:
                    continue;

            }

            const costoMaterial =
                (precioKg / 1000) * Number(producto.gramos);

            const precio =
                Math.round(costoMaterial * Number(margen));

            await pool.query(
                `
                UPDATE productos
                SET precio = $1
                WHERE id = $2
                `,
                [
                    precio,
                    producto.id
                ]
            );

            actualizados++;

        }

        res.json({
            mensaje: `${actualizados} productos actualizados`
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al recalcular precios"
        });

    }

};

module.exports = {
    obtenerConfiguracion,
    actualizarConfiguracion,
    recalcularPrecios
};