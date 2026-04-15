// ============================================================
// CONFIG
// ============================================================
const WHATSAPP_NUMBER = '57566110';

// ============================================================
// STATE
// ============================================================
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || {};
let activeFilter = 'all';
let currentProduct = null;
let galleryIndex = 0;

// ============================================================
// MENU HAMBURGUESA (NUEVO)
// ============================================================
function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("open");
  document.getElementById("menuOverlay").classList.toggle("open");
}

// ============================================================
// FETCH PRODUCTOS
// ============================================================
fetch('js/productos.json')
  .then(res => res.json())
  .then(data => {

    products = data.map(p => ({
      id: p.id,
      name: p.nombre,
      price: p.precio,
      cat: p.categoria,
      desc: p.descripcion,
      images: p.imagenes,
      icon: "🧱"
    }));

    document.getElementById("loader").style.display = "none";

    renderProducts();
    updateCart();
  })
  .catch(err => console.error("Error cargando productos:", err));

// ============================================================
// RENDER PRODUCTOS
// ============================================================
function renderProducts() {
  const grid = document.getElementById('productsGrid');

  const filtered = activeFilter === 'all'
    ? products
    : products.filter(p => p.cat === activeFilter);

  grid.innerHTML = filtered.map(p => {

    const inCart = cart[p.id];

    const imgHtml = (p.images && p.images.length > 0)
      ? `<img src="${p.images[0]}" alt="${p.name}" />`
      : `<span class="emoji-placeholder">${p.icon}</span>`;

    return `
    <div class="card" onclick="openModal('${p.id}')">
      <div class="card-img">${imgHtml}</div>

      <div class="card-body">
        <div class="card-cat">${p.cat}</div>
        <div class="card-name">${p.name}</div>

        <div class="card-desc">
          ${p.desc.substring(0,80)}${p.desc.length > 80 ? '…' : ''}
        </div>

        <div class="card-footer">
          <span class="price">$${p.price.toLocaleString('es-AR')}</span>

          <button class="add-btn ${inCart ? 'added' : ''}"
            onclick="addToCart('${p.id}', event)">
            ${inCart ? '✓ Agregado' : '+ Agregar'}
          </button>
        </div>

      </div>
    </div>`;
  }).join('');
}

// ============================================================
// FILTROS (ARREGLADO)
// ============================================================
function filter(cat, btn) {
  activeFilter = cat;

  document.querySelectorAll('.side-menu button')
    .forEach(b => b.classList.remove('active'));

  if (btn) btn.classList.add('active');

  renderProducts();

  // cerrar menú al elegir categoría (mejor UX)
  toggleMenu();
}

// ============================================================
// CARRITO
// ============================================================
function addToCart(id, e) {
  if (e) e.stopPropagation();

  const p = products.find(p => p.id === id);

  if (cart[id]) cart[id].qty++;
  else cart[id] = { ...p, qty: 1 };

  updateCart();
  renderProducts();
  showToast(`${p.name} agregado 🎉`);
}

function removeFromCart(id) {
  delete cart[id];
  updateCart();
  renderProducts();
}

function changeQty(id, delta) {
  if (!cart[id]) return;

  cart[id].qty += delta;

  if (cart[id].qty <= 0) delete cart[id];

  updateCart();
  renderProducts();
}

function updateCart() {
  const items = Object.values(cart);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  document.getElementById('cartBadge').textContent = count;

  const footer = document.getElementById('cartFooter');
  const itemsEl = document.getElementById('cartItems');

  if (items.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">
      <div class="cart-empty-icon">🛒</div>
      <p>Tu carrito está vacío</p>
    </div>`;
    footer.style.display = 'none';
  } else {

    itemsEl.innerHTML = items.map(i => {

      const thumb = (i.images && i.images.length > 0)
        ? `<img src="${i.images[0]}" />`
        : i.icon;

      return `
      <div class="cart-item">

        <div class="cart-item-icon">${thumb}</div>

        <div style="flex:1">
          <div class="cart-item-name">${i.name}</div>
          <div class="cart-item-price">
            $${(i.price * i.qty).toLocaleString('es-AR')}
          </div>

          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${i.id}',-1)">−</button>
            <span class="qty-num">${i.qty}</span>
            <button class="qty-btn" onclick="changeQty('${i.id}',1)">+</button>
          </div>
        </div>

        <button class="remove-btn" onclick="removeFromCart('${i.id}')">✕</button>

      </div>`;
    }).join('');

    document.getElementById('cartTotal').textContent =
      '$' + total.toLocaleString('es-AR');

    footer.style.display = 'block';
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// ============================================================
// UI CART
// ============================================================
function toggleCart() {
  document.getElementById('cartPanel').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}