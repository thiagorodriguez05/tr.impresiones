// ============================================================
// CONFIG
// ============================================================

const WHATSAPP_NUMBER = "57566110";

// ============================================================
// PROMOCIÓN
// ============================================================

const PROMO = {
    activa: true,
    descuento: 10
};

function precioPromo(precio) {

    if (!PROMO.activa) return precio;

    return Math.round(precio * (1 - PROMO.descuento / 100));

}

// ============================================================
// STATE
// ============================================================

let products = [];
let activeFilter = "all";

// ============================================================
// RENDER PRODUCTOS
// ============================================================

function renderProducts() {

    const grid = document.getElementById("productsGrid");

    const filtered = activeFilter === "all"
        ? products
        : products.filter(p => p.cat === activeFilter);

    grid.innerHTML = filtered.map(p => {

        const inCart = cart[p.id];
        const precioConPromo = precioPromo(p.price);

        const imgHtml = (p.images && p.images.length > 0)
            ? `<img src="${p.images[0]}" alt="${p.name}" />`
            : `<span class="emoji-placeholder">${p.icon}</span>`;

        return `
        <div class="card" onclick="openModal('${p.id}')">

            ${PROMO.activa ? `
                <div class="discount-badge">
                    -${PROMO.descuento}%
                </div>
            ` : ""}

            <div class="card-img">
                ${imgHtml}
            </div>

            <div class="card-body">

                <div class="card-cat">
                    ${p.catName}
                </div>

                <div class="card-name">
                    ${p.name}
                </div>

                <div class="card-desc">
                    ${p.desc.substring(0, 80)}
                    ${p.desc.length > 80 ? "…" : ""}
                </div>

                <div class="card-footer">

                    <div class="price-box">

                        ${
                            PROMO.activa
                                ? `
                                    <span class="old-price">
                                        $${p.price.toLocaleString("es-AR")}
                                    </span>

                                    <span class="promo-price">
                                        $${precioConPromo.toLocaleString("es-AR")}
                                    </span>
                                `
                                : `
                                    <span class="promo-price">
                                        $${p.price.toLocaleString("es-AR")}
                                    </span>
                                `
                        }

                    </div>

                    <button
                        class="add-btn ${inCart ? "added" : ""}"
                        onclick="addToCart('${p.id}', event)">

                        ${inCart ? "✓ Agregado" : "+ Agregar"}

                    </button>

                </div>

            </div>

        </div>
        `;

    }).join("");

}

// ============================================================
// FILTRAR
// ============================================================

function filter(cat) {

    activeFilter = cat;

    document
        .querySelectorAll(".side-menu button")
        .forEach(btn => btn.classList.remove("active"));

    if (cat === "all") {

        document
            .querySelector(".side-menu button")
            ?.classList.add("active");

    } else {

        document
            .querySelectorAll(".side-menu button")
            .forEach(btn => {

                if (
                    btn.textContent
                        .toLowerCase()
                        .includes(cat)
                ) {

                    btn.classList.add("active");

                }

            });

    }

    renderProducts();

}