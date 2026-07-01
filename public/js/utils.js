// ============================================================
// TOAST
// ============================================================

function showToast(texto) {

    const toast = document.getElementById("toast");

    toast.textContent = texto;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

// ============================================================
// MENU LATERAL
// ============================================================

function toggleMenu() {

    document
        .getElementById("sideMenu")
        .classList
        .toggle("open");

    document
        .getElementById("menuOverlay")
        .classList
        .toggle("open");

}

// ============================================================
// CARGAR CATEGORIAS
// ============================================================

fetch("/api/categorias")
    .then(res => res.json())
    .then(categorias => {

        const lista = document.getElementById("listaCategorias");

        lista.innerHTML = `
            <button
                class="active"
                onclick="filter('all');toggleMenu();">
                Todos
            </button>
        `;

        categorias.forEach(cat => {

            lista.innerHTML += `
                <button
                    onclick="filter('${cat.slug}');toggleMenu();">
                    ${cat.nombre}
                </button>
            `;

        });

    })
    .catch(console.error);

// ============================================================
// CERRAR MODAL CON ESC
// ============================================================

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        closeModal();

    }

});

// ============================================================
// CERRAR MENU CON ESC
// ============================================================

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        const menu =
            document.getElementById("sideMenu");

        if (menu.classList.contains("open")) {

            toggleMenu();

        }

    }

});