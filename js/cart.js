const CART_STORAGE_KEY = "cart";

// Adjust these if your checkout flow expects different values
const TAX_RATE = 0.08; // 8%
const SHIPPING_TEXT = "FREE";
const SHIPPING_AMOUNT = 0;

function parseMoneyToNumber(maybeMoney) {
  const s = String(maybeMoney ?? "");
  const normalized = s.replace(/[^0-9.]/g, "");
  const num = Number.parseFloat(normalized);
  return Number.isNaN(num) ? 0 : num;
}

function safeParseCart(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function formatMoney(value) {
  // Your UI uses $ and 2 decimals
  return `$${value.toFixed(2)}`;
}

function getCartItems() {
  return safeParseCart(window.localStorage.getItem(CART_STORAGE_KEY));
}

function setCartItems(nextItems) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
}

function findCartItemIndex(items, productId) {
  // Product.Details.html stores `id` as the product slug from shop.html
  return items.findIndex((it) => String(it?.id ?? "") === String(productId ?? ""));
}

function createCartRow(item, index) {
  const cartTableEl = document.querySelector(".cart-table");
  if (!cartTableEl) return null;

  // Create item container with same structural classes as existing markup
  const cartItemEl = document.createElement("div");
  cartItemEl.className = "cart-item";

  // Product cell
  const colProductEl = document.createElement("div");
  colProductEl.className = "col-product item-details";

  const imagePlaceholderEl = document.createElement("div");
  imagePlaceholderEl.className = "item-image-placeholder";

  // If the CSS expects a background-image, set it here. Fallback to empty placeholder.
  if (item?.img) {
    imagePlaceholderEl.style.backgroundImage = `url('${item.img}')`;
    imagePlaceholderEl.style.backgroundSize = "cover";
    imagePlaceholderEl.style.backgroundPosition = "center";
  }

  const infoEl = document.createElement("div");
  infoEl.className = "item-info";

  const nameEl = document.createElement("h2");
  nameEl.className = "item-name";
  nameEl.textContent = String(item?.name ?? "");

  const sizeEl = document.createElement("p");
  sizeEl.className = "item-size";
  sizeEl.textContent = "Size: -";

  const removeBtn = document.createElement("button");
  removeBtn.className = "btn-remove";
  removeBtn.type = "button";
  removeBtn.dataset.cartIndex = String(index);
  removeBtn.dataset.productId = String(item?.id ?? "");

  removeBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
    REMOVE
  `;

  infoEl.appendChild(nameEl);
  infoEl.appendChild(sizeEl);
  infoEl.appendChild(removeBtn);

  colProductEl.appendChild(imagePlaceholderEl);
  colProductEl.appendChild(infoEl);

  // Price cell
  const priceEl = document.createElement("div");
  priceEl.className = "col-price item-val";
  priceEl.textContent = String(item?.price ?? "");

  // Quantity cell (cart spec requires Price and Quantity; UI currently shows qty selector visually)
  const qtyEl = document.createElement("div");
  qtyEl.className = "col-quantity item-val";
  qtyEl.textContent = ""; // We'll render a simple quantity value to avoid conflicting UI expectations

  const qtyText = document.createElement("div");
  qtyText.style.fontWeight = "500";
  qtyText.textContent = `x ${String(item?.quantity ?? "1")}`;
  qtyEl.appendChild(qtyText);

  // Total cell
  const unitPrice = parseMoneyToNumber(item?.price);
  const qtyNum = Number.parseInt(String(item?.quantity ?? "1"), 10);
  const safeQty = Number.isNaN(qtyNum) ? 1 : Math.max(1, qtyNum);
  const lineTotal = unitPrice * safeQty;

  const lineTotalEl = document.createElement("div");
  lineTotalEl.className = "col-total item-val";
  lineTotalEl.textContent = formatMoney(lineTotal);

  // Assemble row
  cartItemEl.appendChild(colProductEl);
  cartItemEl.appendChild(priceEl);
  cartItemEl.appendChild(qtyEl);
  cartItemEl.appendChild(lineTotalEl);

  // Bind remove action
  removeBtn.addEventListener("click", () => {
    const productId = removeBtn.dataset.productId;
    const items = getCartItems();
    const idx = findCartItemIndex(items, productId);

    const safeIdx = idx >= 0 ? idx : Number.parseInt(removeBtn.dataset.cartIndex ?? "-1", 10);
    if (safeIdx < 0 || safeIdx >= items.length) return;

    items.splice(safeIdx, 1);
    setCartItems(items);
    renderCart();
  });

  return cartItemEl;
}

function renderTotals(cartItems) {
  const subtotalEl = document.querySelector(".summary-row span:nth-child(2)");
  const shippingEl = document.querySelector(".summary-row:nth-child(2) span:nth-child(2)");
  const taxEl = document.querySelector(".summary-row:nth-child(3) span:nth-child(2)");
  const totalEl = document.querySelector(".total-row span:nth-child(2)");

  const summary = document.querySelector(".summary-rows");
  if (!summary || !subtotalEl || !shippingEl || !taxEl || !totalEl) return;

  const subtotal = cartItems.reduce((sum, item) => {
    const unitPrice = parseMoneyToNumber(item?.price);
    const qtyNum = Number.parseInt(String(item?.quantity ?? "1"), 10);
    const safeQty = Number.isNaN(qtyNum) ? 1 : Math.max(1, qtyNum);
    return sum + unitPrice * safeQty;
  }, 0);

  const shipping = SHIPPING_AMOUNT;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  // Write values
  subtotalEl.textContent = formatMoney(subtotal);
  shippingEl.textContent = SHIPPING_TEXT;
  taxEl.textContent = formatMoney(tax);
  totalEl.textContent = formatMoney(total);
}

function renderCart() {
  const cartTableEl = document.querySelector(".cart-table");
  if (!cartTableEl) return;

  const existingItems = Array.from(cartTableEl.querySelectorAll(".cart-item"));
  const existingSeparators = Array.from(cartTableEl.querySelectorAll(".item-separator"));

  // Clear existing rendered items (keep header)
  existingItems.forEach((el) => {
    el.remove();
  });
  existingSeparators.forEach((el) => el.remove());

  const cartItems = getCartItems();

  if (cartItems.length === 0) {
    // Insert empty state row to keep layout stable
    const emptyRow = document.createElement("div");
    emptyRow.className = "cart-item";
    emptyRow.style.color = "#CCCCCC";
    emptyRow.style.justifyContent = "center";
    emptyRow.style.gridColumn = "1 / -1";
    emptyRow.innerHTML = `<div style="grid-column: 1 / -1;">YOUR CART IS EMPTY.</div>`;
    cartTableEl.appendChild(emptyRow);

    // Update totals to zeros
    renderTotals([]);
    return;
  }

  cartItems.forEach((item, idx) => {
    const rowEl = createCartRow(item, idx);
    if (!rowEl) return;

    cartTableEl.appendChild(rowEl);

    if (idx !== cartItems.length - 1) {
      const sep = document.createElement("hr");
      sep.className = "item-separator";
      cartTableEl.appendChild(sep);
    }
  });

  renderTotals(cartItems);
}

document.addEventListener("DOMContentLoaded", () => {
  const continueBtn = document.querySelector(".btn-continue-shopping");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      // Must NOT clear the cart
      window.location.href = "shop.html";
    });
  }

  const proceedBtn = document.querySelector(".btn-proceed");
  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      // IMPORTANT: Do NOT clear the cart here; checkout reads localStorage["cart"]
      window.location.href = "Checkout1.html";
    });
  }

  renderCart();
});
