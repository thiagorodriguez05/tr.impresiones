const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const productosRoutes = require("./routes/productos");
const categoriasRoutes = require("./routes/categorias");

const app = express();

app.set("trust proxy", 1);

// ======================
// MIDDLEWARES
// ======================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "trimpresiones",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Cambiar a true cuando uses HTTPS en producción
            maxAge: 1000 * 60 * 60 * 24 // 24 horas
        }
    })
);

// ======================
// ARCHIVOS ESTÁTICOS
// ======================

app.use(express.static(path.join(__dirname, "public")));

app.use(
    "/img",
    express.static(path.join(__dirname, "img"))
);

app.use(
    "/uploads",
    express.static(path.join(__dirname, "public", "uploads"))
);

app.use(
    "/admin",
    express.static(path.join(__dirname, "admin"))
);

// ======================
// INICIO
// ======================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

// ======================
// MULTER
// ======================

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, path.join(__dirname, "public", "uploads"));

    },

    filename(req, file, cb) {

        const nombre =
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "_");

        cb(null, nombre);

    }

});

const upload = multer({ storage });

// ======================
// SUBIR IMÁGENES
// ======================

app.post(
    "/api/upload",
    upload.array("imagenes", 10),
    (req, res) => {

        if (!req.files || req.files.length === 0) {

            return res.status(400).json({
                error: "No se recibieron imágenes."
            });

        }

        const rutas = req.files.map(file => ({
            ruta: "uploads/" + file.filename
        }));

        res.json(rutas);

    }
);

// ======================
// LOGIN
// ======================

app.get("/login", (req, res) => {

    res.sendFile(
        path.join(__dirname, "admin", "login.html")
    );

});

app.post("/login", (req, res) => {

    const { usuario, password } = req.body;

    if (
        usuario === "admin" &&
        password === "1234"
    ) {

        req.session.usuario = usuario;

        return res.redirect("/admin");

    }

    res.redirect("/login?error=1");

});

// ======================
// MIDDLEWARE LOGIN
// ======================

function verificarLogin(req, res, next) {

    if (!req.session.usuario) {

        return res.redirect("/login");

    }

    next();

}

// ======================
// PANEL ADMIN
// ======================

app.get(
    "/admin",
    verificarLogin,
    (req, res) => {

        res.sendFile(
            path.join(__dirname, "admin", "admin.html")
        );

    }
);

// ======================
// LOGOUT
// ======================

app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});

// ======================
// API
// ======================

app.use("/api/productos", productosRoutes);

app.use("/api/categorias", categoriasRoutes);

// ======================
// ERROR 404
// ======================

app.use((req, res) => {

    res.status(404).json({
        error: "Ruta no encontrada"
    });

});

// ======================
// SERVIDOR
// ======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);

});