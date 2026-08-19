const express = require("express");
const serverless = require("serverless-http");

const productosRoutes = require("../../routes/productosRoutes");
const categoriasRoutes = require("../../routes/categoriasRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/productos", productosRoutes);
app.use("/categorias", categoriasRoutes);

module.exports.handler = serverless(app);
