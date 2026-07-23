const express = require("express");
const router = express.Router();

const {
    obtenerConfiguracion,
    actualizarConfiguracion,
    recalcularPrecios
} = require("../controllers/configuracionController");

// Obtener la configuración
router.get("/", obtenerConfiguracion);

// Actualizar la configuración
router.put("/", actualizarConfiguracion);

// Recalcular precios de todos los productos
router.put(
    "/recalcular-precios",
    recalcularPrecios
);

module.exports = router;