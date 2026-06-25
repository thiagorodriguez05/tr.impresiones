const sql = require("mssql/msnodesqlv8");

require("dotenv").config();

const config = {

    server: process.env.DB_SERVER,

    database: process.env.DB_DATABASE,

    driver: "msnodesqlv8",

    options: {

        trustedConnection: true,

        trustServerCertificate: true

    },

    connectionString:
        `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`

};

let pool;

async function getConnection() {

    try {

        if (pool) {

            return pool;

        }

        pool = await sql.connect(config);

        console.log("✅ SQL Server conectado");

        return pool;

    } catch (error) {

        console.error("❌ Error conectando SQL:", error);

        throw error;

    }

}

module.exports = {

    sql,
    getConnection

};