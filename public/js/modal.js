// ============================================================
// MODAL
// ============================================================

let currentProduct = null;
let galleryIndex = 0;

// ------------------------------------------------------------
// ABRIR MODAL
// ------------------------------------------------------------

function openModal(id) {

    currentProduct = products.find(
        p => Number(p.id) === Number(id)
    );

    if (!currentProduct) {
        console.error("Producto no encontrado:", id);
        return;
    }

    galleryIndex = 0;

    const slides =
        currentProduct.images && currentProduct.images.length > 0
            ? currentProduct.images
            : [null];

    const inner = document.getElementById("galleryInner");

    inner.style.transform = "translateX(0%)";

    inner.innerHTML = slides.map(src =>

        src
            ? `
                <div class="modal-gallery-slide">
                    <img src="${src}" alt="${currentProduct.name}">
                </div>
              `
            : `
                <div class="modal-gallery-slide">
                    ${currentProduct.icon}
                </div>
              `

    ).join("");

    const dots = document.getElementById("galleryDots");

    if (slides.length > 1) {

        dots.innerHTML = slides.map((_, i) =>

            `
            <div
                class="gallery-dot ${i === 0 ? "active" : ""}"
                onclick="goToSlide(${i})">
            </div>
            `

        ).join("");

        document.getElementById("galleryPrev").style.display = "";
        document.getElementById("galleryNext").style.display = "";

    } else {

        dots.innerHTML = "";

        document.getElementById("galleryPrev").style.display = "none";
        document.getElementById("galleryNext").style.display = "none";

    }

    document.getElementById("modalCat").textContent =
        currentProduct.catName;

    document.getElementById("modalName").textContent =
        currentProduct.name;

    document.getElementById("modalDesc").textContent =
        currentProduct.desc;

    document.getElementById("modalPrice").textContent =
        "$" + currentProduct.price.toLocaleString("es-AR");

    updateModalBtn();

    document
        .getElementById("modalOverlay")
        .classList
        .add("open");

    document.body.style.overflow = "hidden";

}

// ------------------------------------------------------------
// BOTON DEL MODAL
// ------------------------------------------------------------

function updateModalBtn() {

    if (!currentProduct) return;

    const btn = document.getElementById("modalAddBtn");

    if (cart[currentProduct.id]) {

        btn.textContent = "✓ En el carrito";
        btn.style.background = "rgba(167,139,250,.2)";

    } else {

        btn.textContent = "+ Agregar al carrito";
        btn.style.background = "";

    }

}

// ------------------------------------------------------------
// AGREGAR DESDE MODAL
// ------------------------------------------------------------

function addFromModal() {

    if (!currentProduct) return;

    addToCart(currentProduct.id);

    updateModalBtn();

}

// ------------------------------------------------------------
// CERRAR MODAL
// ------------------------------------------------------------

function closeModal() {

    document
        .getElementById("modalOverlay")
        .classList
        .remove("open");

    document.body.style.overflow = "";

    currentProduct = null;

}

// ------------------------------------------------------------
// CERRAR HACIENDO CLICK AFUERA
// ------------------------------------------------------------

function closeModalIfOutside(e) {

    if (e.target.id === "modalOverlay") {

        closeModal();

    }

}

// ------------------------------------------------------------
// GALERIA
// ------------------------------------------------------------

function slideGallery(dir) {

    if (!currentProduct) return;

    const slides =
        currentProduct.images && currentProduct.images.length > 0
            ? currentProduct.images
            : [null];

    galleryIndex =
        (galleryIndex + dir + slides.length) % slides.length;

    document.getElementById("galleryInner").style.transform =
        `translateX(-${galleryIndex * 100}%)`;

    document
        .querySelectorAll(".gallery-dot")
        .forEach((dot, i) => {

            dot.classList.toggle(
                "active",
                i === galleryIndex
            );

        });

}

// ------------------------------------------------------------
// IR A UNA IMAGEN
// ------------------------------------------------------------

function goToSlide(i) {

    galleryIndex = i;

    document.getElementById("galleryInner").style.transform =
        `translateX(-${galleryIndex * 100}%)`;

    document
        .querySelectorAll(".gallery-dot")
        .forEach((dot, j) => {

            dot.classList.toggle(
                "active",
                j === galleryIndex
            );

        });

}