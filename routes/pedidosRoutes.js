const express = require("express");

const router = express.Router();

const {

    listarPedidos,
    obtenerPedido,
    agregarPedido,
    editarPedido,
    eliminarPedido,
    cambiarEstadoPedido

} = require("../controllers/pedidosController");

// ======================
// RUTAS
// ======================

router.get("/", listarPedidos);

router.get("/:id", obtenerPedido);

router.post("/", agregarPedido);

router.put("/:id", editarPedido);

router.put("/:id/estado", cambiarEstadoPedido);

router.delete("/:id", eliminarPedido);

module.exports = router;