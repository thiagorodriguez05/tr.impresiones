// ============================================================
// API
// ============================================================

async function cargarProductos() {

    try {

        const respuesta = await fetch("/api/productos");

        const data = await respuesta.json();

        products = data.map(p => ({

            id: p.id,

            name: p.nombre,

            price: Number(p.precio),

            cat: p.categoria.toLowerCase(),

            catName: p.categoria,

            desc: p.descripcion || "",

            images: (p.imagenes || []).map(img => "/" + img),

            icon: "🧱"

        }));

        document.getElementById("loader").style.display = "none";

        renderProducts();

        updateCart();

    } catch (error) {

        console.error("Error cargando productos:", error);

    }

}

// ============================================================
// INICIAR APP
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

});