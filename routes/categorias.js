const express = require("express");

const router = express.Router();

const {
    listarCategorias
} = require("../controllers/categoriasController");

router.get("/", listarCategorias);

module.exports = router;