// ============================================================
// CARRITO
// ============================================================

let cart = JSON.parse(localStorage.getItem("cart")) || {};

// ------------------------------------------------------------
// AGREGAR
// ------------------------------------------------------------

function addToCart(id, e) {

    if (e) e.stopPropagation();

    const producto = products.find(
        p => Number(p.id) === Number(id)
    );

    if (!producto) {
        console.error("Producto no encontrado:", id);
        return;
    }

    if (cart[id]) {

        cart[id].qty++;

    } else {

        cart[id] = {
            ...producto,
            qty: 1
        };

    }
    console.log("Producto que entra al carrito:");
console.log(producto);

console.log("Carrito completo:");
console.log(cart);

    updateCart();
    renderProducts();

    if (typeof updateModalBtn === "function") {
        updateModalBtn();
    }

    showToast(`${producto.name} agregado 🎉`);

}

// ------------------------------------------------------------
// ELIMINAR
// ------------------------------------------------------------

function removeFromCart(id) {

    delete cart[id];

    updateCart();
    renderProducts();

    if (typeof updateModalBtn === "function") {
        updateModalBtn();
    }

}

// ------------------------------------------------------------
// CAMBIAR CANTIDAD
// ------------------------------------------------------------

function changeQty(id, delta) {

    if (!cart[id]) return;

    cart[id].qty += delta;

    if (cart[id].qty <= 0) {

        delete cart[id];

    }

    updateCart();
    renderProducts();

    if (typeof updateModalBtn === "function") {
        updateModalBtn();
    }

}

// ------------------------------------------------------------
// ACTUALIZAR
// ------------------------------------------------------------

function updateCart() {
console.log("Items del carrito:");
console.dir(Object.values(cart), { depth: null });

Object.values(cart).forEach(item => {
    console.log("ITEM:", item);
    console.log("ID:", item.id);
    console.log("NAME:", item.name);
    console.log("PRICE:", item.price);
    console.log("IMAGES:", item.images);
});
    const items = Object.values(cart);

    const total = items.reduce(
        (s, i) => s + Number(i.price) * i.qty,
        0
    );

    const cantidad = items.reduce(
        (s, i) => s + i.qty,
        0
    );

    document.getElementById("cartBadge").textContent = cantidad;

    const footer = document.getElementById("cartFooter");
    const itemsEl = document.getElementById("cartItems");

    if (items.length === 0) {

        itemsEl.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Tu carrito está vacío</p>
            </div>
        `;

        footer.style.display = "none";

    } else {

        itemsEl.innerHTML = items.map(item => {

            const imagen = item.images?.length
                ? `<img src="${item.images[0]}" alt="${item.name}">`
                : `<span>${item.icon || "🧱"}</span>`;

            return `
            <div class="cart-item">

                <div class="cart-item-icon">
                    ${imagen}
                </div>

                <div style="flex:1">

                    <div class="cart-item-name">
                        ${item.name}
                    </div>

                    <div class="cart-item-price">
                        $${(Number(item.price) * item.qty).toLocaleString("es-AR")}
                    </div>

                    <div class="cart-item-qty">

                        <button
                            class="qty-btn"
                            onclick="changeQty('${item.id}',-1)">
                            −
                        </button>

                        <span class="qty-num">
                            ${item.qty}
                        </span>

                        <button
                            class="qty-btn"
                            onclick="changeQty('${item.id}',1)">
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart('${item.id}')">
                    ✕
                </button>

            </div>
            `;

        }).join("");

        document.getElementById("cartTotal").textContent =
            "$" + total.toLocaleString("es-AR");

        footer.style.display = "block";

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}

// ------------------------------------------------------------
// PANEL
// ------------------------------------------------------------

function toggleCart() {

    document
        .getElementById("cartPanel")
        .classList
        .toggle("open");

    document
        .getElementById("cartOverlay")
        .classList
        .toggle("open");

}

// ------------------------------------------------------------
// WHATSAPP
// ------------------------------------------------------------

function whatsapp() {

    const items = Object.values(cart);

    if (items.length === 0) {

        showToast("El carrito está vacío");
        return;

    }

    const detalle = items.map(item =>

        `• ${item.name}
Cantidad: ${item.qty}
Subtotal: $${(Number(item.price) * item.qty).toLocaleString("es-AR")}`

    ).join("\n\n");

    const total = items.reduce(

        (s, i) => s + Number(i.price) * i.qty,

        0

    );

    const mensaje = encodeURIComponent(

`Hola 👋

Quiero realizar este pedido:

${detalle}

Total: $${total.toLocaleString("es-AR")}`

    );

    window.open(

        `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`,

        "_blank"

    );

}