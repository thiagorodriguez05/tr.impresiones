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
  .catch(err => console.error(err));

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
// FILTROS
// ============================================================
function filter(cat) {
  activeFilter = cat;

  // actualizar botones activos (opcional pero pro)
  document.querySelectorAll('.side-menu button')
    .forEach(b => b.classList.remove('active'));

  const clicked = Array.from(document.querySelectorAll('.side-menu button'))
    .find(b => b.textContent.toLowerCase().includes(cat));

  if (clicked) clicked.classList.add('active');

  renderProducts();
}

// ============================================================
// CARRITO
// ============================================================
function addToCart(id, e) {
  if (e) e.stopPropagation();

  const p = products.find(p => p.id === id);

  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { ...p, qty: 1 };
  }

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

  if (cart[id].qty <= 0) {
    delete cart[id];
  }

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
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Tu carrito está vacío</p>
      </div>`;
    footer.style.display = 'none';
  } else {
    itemsEl.innerHTML = items.map(i => {
      const thumb = (i.images && i.images.length > 0)
        ? `<img src="${i.images[0]}" alt="${i.name}" />`
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
// CART UI
// ============================================================
function toggleCart() {
  document.getElementById('cartPanel').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// ============================================================
// MODAL
// ============================================================
function openModal(id) {
  currentProduct = products.find(p => p.id === id);
  galleryIndex = 0;

  const slides = (currentProduct.images && currentProduct.images.length > 0)
    ? currentProduct.images
    : [null];

  const inner = document.getElementById('galleryInner');

  inner.innerHTML = slides.map(src =>
    src
      ? `<div class="modal-gallery-slide">
           <img src="${src}" alt="${currentProduct.name}" />
         </div>`
      : `<div class="modal-gallery-slide">${currentProduct.icon}</div>`
  ).join('');

  const dots = document.getElementById('galleryDots');

  if (slides.length > 1) {
    dots.innerHTML = slides.map((_, i) =>
      `<div class="gallery-dot ${i === 0 ? 'active' : ''}"
        onclick="goToSlide(${i})"></div>`
    ).join('');

    document.getElementById('galleryPrev').style.display = '';
    document.getElementById('galleryNext').style.display = '';
  } else {
    dots.innerHTML = '';
    document.getElementById('galleryPrev').style.display = 'none';
    document.getElementById('galleryNext').style.display = 'none';
  }

  document.getElementById('modalCat').textContent = currentProduct.cat;
  document.getElementById('modalName').textContent = currentProduct.name;
  document.getElementById('modalDesc').textContent = currentProduct.desc;
  document.getElementById('modalPrice').textContent =
    '$' + currentProduct.price.toLocaleString('es-AR');

  updateModalBtn();

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateModalBtn() {
  const btn = document.getElementById('modalAddBtn');

  if (cart[currentProduct.id]) {
    btn.textContent = '✓ En el carrito';
    btn.style.background = 'rgba(167,139,250,0.2)';
  } else {
    btn.textContent = '+ Agregar al carrito';
    btn.style.background = '';
  }
}

function addFromModal() {
  addToCart(currentProduct.id);
  updateModalBtn();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentProduct = null;
}

function closeModalIfOutside(e) {
  if (e.target.id === "modalOverlay") {
    closeModal();
  }
}

// ============================================================
// GALERÍA
// ============================================================
function slideGallery(dir) {
  if (!currentProduct) return;

  const slides = (currentProduct.images && currentProduct.images.length > 0)
    ? currentProduct.images
    : [null];

  galleryIndex = (galleryIndex + dir + slides.length) % slides.length;

  document.getElementById('galleryInner').style.transform =
    `translateX(-${galleryIndex * 100}%)`;

  document.querySelectorAll('.gallery-dot')
    .forEach((d, i) => d.classList.toggle('active', i === galleryIndex));
}

function goToSlide(i) {
  galleryIndex = i;

  document.getElementById('galleryInner').style.transform =
    `translateX(-${i * 100}%)`;

  document.querySelectorAll('.gallery-dot')
    .forEach((d, j) => d.classList.toggle('active', j === i));
}

// ============================================================
// WHATSAPP
// ============================================================
function whatsapp() {
  const items = Object.values(cart);

  if (items.length === 0) {
    showToast("El carrito está vacío");
    return;
  }

  const lines = items.map(i =>
    `- ${i.name} x${i.qty} = $${(i.price * i.qty).toLocaleString('es-AR')}`
  ).join('\n');

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const msg = encodeURIComponent(
    `Hola! Quiero hacer el siguiente pedido en tr.impresiones:\n\n${lines}\n\nTotal: $${total.toLocaleString('es-AR')}`
  );

  window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${msg}`);
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
// ============================================================
// MENÚ HAMBURGUESA (ARREGLADO)
// ============================================================
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("menuOverlay");

  menu.classList.toggle("open");
  overlay.classList.toggle("open");
}

// cerrar al hacer click fuera (extra seguridad)
document.getElementById("menuOverlay").addEventListener("click", () => {
  document.getElementById("sideMenu").classList.remove("open");
  document.getElementById("menuOverlay").classList.remove("open");
});