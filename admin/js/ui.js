// ====================================
// LOADER
// ====================================

function mostrarLoader() {

    const loader = document.getElementById("loader");

    if (loader) {

        loader.style.display = "flex";

    }

}

function ocultarLoader() {

    const loader = document.getElementById("loader");

    if (loader) {

        loader.style.display = "none";

    }

}

// ====================================
// TOAST
// ====================================

function mostrarToast(texto, tiempo = 3000) {

    const toast = document.getElementById("toast");
    const textoToast = document.getElementById("toast-text");

    if (!toast || !textoToast) {

        alert(texto);
        return;

    }

    textoToast.textContent = texto;

    toast.classList.remove("hidden");
    toast.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {

        toast.classList.remove("show");
        toast.classList.add("hidden");

    }, tiempo);

}

// ====================================
// NAVEGACIÓN PANEL
// ====================================

function iniciarNavegacion() {

    const links = document.querySelectorAll(".sidebar a");
    const sections = document.querySelectorAll(".content-section");

    links.forEach(link => {

        link.addEventListener("click", e => {

            e.preventDefault();

            const section = link.dataset.section;

            if (!section) return;

            links.forEach(l =>
                l.classList.remove("active")
            );

            link.classList.add("active");

            sections.forEach(s =>
                s.classList.add("hidden")
            );

            const destino =
                document.getElementById(
                    `${section}-section`
                );

            if (destino) {

                destino.classList.remove("hidden");

            }

        });

    });

}

// ====================================
// MODALES
// ====================================

function abrirModal(id) {

    document
        .getElementById(id)
        ?.classList.remove("hidden");

}

function cerrarModal(id) {

    document
        .getElementById(id)
        ?.classList.add("hidden");

}