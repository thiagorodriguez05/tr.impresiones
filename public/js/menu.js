// ============================================================
// MENÚ LATERAL
// ============================================================

document
    .getElementById("menuOverlay")
    .addEventListener("click", () => {

        cerrarMenu();

    });

function toggleMenu() {

    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    menu.classList.toggle("open");
    overlay.classList.toggle("open");

}

function cerrarMenu() {

    document
        .getElementById("sideMenu")
        .classList.remove("open");

    document
        .getElementById("menuOverlay")
        .classList.remove("open");

}

async function cargarMenuCategorias() {

    try {

        const respuesta =
            await fetch("/api/categorias");

        const categorias =
            await respuesta.json();

        const contenedor =
            document.getElementById("listaCategorias");

        contenedor.innerHTML = "";

        categorias.forEach(categoria => {

            contenedor.innerHTML += `
                <button
                    onclick="filter('${categoria.slug}'); cerrarMenu()">
                    ${categoria.nombre}
                </button>
            `;

        });

    }
    catch (error) {

        console.error(
            "Error cargando categorías:",
            error
        );

    }

}