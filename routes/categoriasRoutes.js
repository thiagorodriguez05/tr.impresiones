const express = require("express");

const router = express.Router();

const {

    listarCategorias,
    obtenerCategoria,
    crearCategoria,
    editarCategoria,
    eliminarCategoria

} = require("../controllers/categoriasController");

// ======================
// GET
// ======================

router.get(
    "/",
    listarCategorias
);

router.get(
    "/:id",
    obtenerCategoria
);

// ======================
// POST
// ======================

router.post(
    "/",
    crearCategoria
);

// ======================
// PUT
// ======================

router.put(
    "/:id",
    editarCategoria
);

// ======================
// DELETE
// ======================

router.delete(
    "/:id",
    eliminarCategoria
);

module.exports = router;