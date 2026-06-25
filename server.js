const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const productosRoutes = require("./routes/productos");
const categoriasRoutes = require("./routes/categorias");
require("dotenv").config();

const app = express();

// ======================
// MIDDLEWARES
// ======================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
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

    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, "public", "uploads"));

    },

    filename: (req, file, cb) => {

        const nombre =
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "_");

        cb(null, nombre);

    }

});

const upload = multer({
    storage
});

// ======================
// SUBIR IMAGEN
// ======================

app.post(
    "/api/upload",
    upload.single("imagen"),
    (req, res) => {

        res.json({

            ruta:
                "uploads/" +
                req.file.filename

        });

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
// ADMIN
// ======================

app.get("/admin", (req, res) => {

    if (!req.session.usuario) {

        return res.redirect("/login");

    }

    res.sendFile(
        path.join(__dirname, "admin", "admin.html")
    );

});

// ======================
// LOGOUT
// ======================

app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});

// ======================
// API PRODUCTOS
// ======================

app.use("/api/productos", productosRoutes);

app.use("/api/categorias", categoriasRoutes);

// ======================
// SERVIDOR
// ======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Servidor iniciado en puerto ${PORT}`);

});