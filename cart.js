// Shared cart logic for all pages
let cart = JSON.parse(localStorage.getItem('samyscripts_cart') || '[]');

function saveCart() { localStorage.setItem('samyscripts_cart', JSON.stringify(cart)); }

function addToCart(name, price, icon, stripeLink) {
  const ex = cart.find(i => i.name === name);
  const qty = parseInt(document.getElementById('qty') ? document.getElementById('qty').textContent : 1);
  if (ex) ex.qty += qty; else cart.push({ name, price, icon, stripeLink, qty });
  saveCart(); updateCartUI(); showToast();
  const qtyEl = document.getElementById('qty');
  if (qtyEl) qtyEl.textContent = 1;
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  saveCart(); updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s,i) => s + i.qty, 0);
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('totalAmount');
  const btn = document.getElementById('checkoutBtn');
  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = '€ ' + total.toFixed(2).replace('.', ',');
  if (btn) btn.disabled = cart.length === 0;
  const c = document.getElementById('drawerItems');
  if (!c) return;
  if (!cart.length) { c.innerHTML = '<div class="empty-cart">Dein Warenkorb ist leer.</div>'; return; }
  c.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.icon}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">€ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
        <div class="cart-item-qty">Menge: ${item.qty}</div>
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">✕</button>
    </div>`).join('');
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// Checkout: redirect to Stripe for each item
function checkout() {
  if (!cart.length) return;
  if (cart.length === 1) {
    window.open(cart[0].stripeLink, '_blank');
  } else {
    // Multiple items: open each in new tab
    cart.forEach(item => window.open(item.stripeLink, '_blank'));
  }
}

// qty controls
let currentQty = 1;
function changeQty(d) {
  currentQty = Math.max(1, currentQty + d);
  const el = document.getElementById('qty');
  if (el) el.textContent = currentQty;
}

document.addEventListener('DOMContentLoaded', updateCartUI);
