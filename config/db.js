const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.connect()
    .then(() => {
        console.log("✅ Conectado a PostgreSQL");
    })
    .catch(err => {
        console.error("❌ Error conectando a PostgreSQL:");
        console.error(err);
    });

console.log("DATABASE_URL cargada:", !!process.env.DATABASE_URL);

module.exports = pool;