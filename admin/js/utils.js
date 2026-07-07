// ====================================
// DOM
// ====================================

function $(id) {

    return document.getElementById(id);

}

// ====================================
// FORMATEAR PRECIO
// ====================================

function formatearPrecio(precio) {

    return Number(precio).toLocaleString("es-AR", {

        minimumFractionDigits: 0,
        maximumFractionDigits: 2

    });

}

// ====================================
// REDONDEAR
// ====================================

function redondear(numero, decimales = 2) {

    return Number(numero.toFixed(decimales));

}

// ====================================
// GENERAR SLUG
// ====================================

function generarSlug(texto) {

    return texto

        .toLowerCase()

        .trim()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .replace(/[^a-z0-9\s-]/g, "")

        .replace(/\s+/g, "-")

        .replace(/-+/g, "-");

}

// ====================================
// VALIDAR INPUT
// ====================================

function estaVacio(valor) {

    return !String(valor).trim();

}

// ====================================
// ESTADO STOCK
// ====================================

function obtenerEstadoStock(stock) {

    stock = Number(stock);

    if (stock <= 0) {

        return "🔴 Sin stock";

    }

    if (stock <= 5) {

        return "🟡 Poco stock";

    }

    return "🟢 Disponible";

}

// ====================================
// LIMPIAR FORMULARIO
// ====================================

function limpiarFormulario(ids) {

    ids.forEach(id => {

        const elemento = $(id);

        if (!elemento) return;

        elemento.value = "";

    });

}

// ====================================
// CONFIRMAR
// ====================================

function confirmar(mensaje) {

    return confirm(mensaje);

}

// ====================================
// ESPERAR
// ====================================

function esperar(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}