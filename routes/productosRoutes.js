const express = require("express");

const router = express.Router();

const {
    listarProductos,
    obtenerProducto,
    agregarProducto,
    editarProducto,
    eliminarProducto
} = require("../controllers/productosController");

// ======================
// RUTAS
// ======================

// Listar todos
router.get("/", listarProductos);

// Obtener uno
router.get("/:id", obtenerProducto);

// Agregar
router.post("/", agregarProducto);

// Editar
router.put("/:id", editarProducto);

// Eliminar
router.delete("/:id", eliminarProducto);

module.exports = router;