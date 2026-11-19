const products = [
  {
    id: 1,
    name: "Big Burger Classic",
    cat: "burger",
    price: 32000,
    emoji: "🍔",
    desc: "Mol go‘shti kotleti, pishloq, bodring, pomidor va maxsus sous."
  },
  {
    id: 2,
    name: "Double Big Burger",
    cat: "burger",
    price: 44000,
    emoji: "🥩",
    desc: "Ikki karra go‘sht, qo‘sh pishloq va dudlangan sous."
  },
  {
    id: 3,
    name: "Crispy Chicken Burger",
    cat: "burger",
    price: 30000,
    emoji: "🍗",
    desc: "Qarsildoq tovuq filesi, aysberg salat va sarimsoqli sous."
  },
  {
    id: 4,
    name: "Kartoshka Fri",
    cat: "snack",
    price: 16000,
    emoji: "🍟",
    desc: "Tashqarisi qarsildoq, ichi yumshoq oltinrang kartoshka."
  },
  {
    id: 5,
    name: "Pishloqli Halqachalar",
    cat: "snack",
    price: 22000,
    emoji: "🧀",
    desc: "Issiq va cho‘ziluvchan pishloqli gazaklar (6 dona)."
  },
  {
    id: 6,
    name: "Muzdek Kola (0.5L)",
    cat: "drink",
    price: 10000,
    emoji: "🥤",
    desc: "Burger bilan ajoyib uyg‘unlashuvchi muzdek ichimlik."
  }
];

let cart = [];

const menuGrid = document.getElementById("menuGrid");
const filters = document.getElementById("filters");
const cartDrawer = document.getElementById("cartDrawer");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

document.getElementById("year").textContent = new Date().getFullYear();

function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so‘m";
}

function renderMenu(category = "all") {
  const list = category === "all"
    ? products
    : products.filter((item) => item.cat === category);

  menuGrid.innerHTML = list
    .map(
      (item) => `
      <article class="card">
        <div>
          <div class="card-thumb">${item.emoji}</div>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
        </div>
        <div class="card-footer">
          <span class="price">${formatPrice(item.price)}</span>
          <button class="add-btn" onclick="addToCart(${item.id})">+ Qo‘shish</button>
        </div>
      </article>
    `
    )
    .join("");
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((c) => c.id !== id);
  }
  renderCart();
}

function renderCart() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCountEl.textContent = totalCount;
  cartTotalEl.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p style="color: var(--muted); text-align: center; margin-top: 32px;">Savatcha hozircha bo‘sh.</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <div style="font-weight: 700;">${item.emoji} ${item.name}</div>
          <div style="font-size: 0.85rem; color: var(--muted);">${formatPrice(item.price * item.qty)}</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `
    )
    .join("");
}

filters.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-btn")) return;
  document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");
  renderMenu(e.target.dataset.cat);
});

openCartBtn.addEventListener("click", () => cartDrawer.classList.add("open"));
closeCartBtn.addEventListener("click", () => cartDrawer.classList.remove("open"));
cartDrawer.addEventListener("click", (e) => {
  if (e.target === cartDrawer) cartDrawer.classList.remove("open");
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Avval savatchaga mahsulot qo‘shing!");
    return;
  }
  alert("Buyurtmangiz qabul qilindi! Big Burger jamoasi tez orada bog‘lanadi.");
  cart = [];
  renderCart();
  cartDrawer.classList.remove("open");
});

renderMenu();
renderCart();
