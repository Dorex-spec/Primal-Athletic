// Strict 3-step gated checkout flow (Checkout 1 → 2 → 3 → Success)
// Storage keys
const CHECKOUT_STORAGE_KEY = "checkoutFormData";
const CHECKOUT_PLACED_KEY = "checkoutPlacedOrderOnce";

// Pages
const SUCCESS_PAGE = "ordercomfired.html";

// Step enum
const STEPS = { SHIPPING: 1, PAYMENT: 2, REVIEW: 3 };

// Currency helpers (cart.js uses a similar approach)
const CART_STORAGE_KEY = "cart";
const TAX_RATE = 0.08;
const SHIPPING_AMOUNT = 0;

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function parseMoneyToNumber(maybeMoney) {
  const s = String(maybeMoney ?? "");
  const normalized = s.replace(/[^0-9.]/g, "");
  const num = Number.parseFloat(normalized);
  return Number.isNaN(num) ? 0 : num;
}

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

function getCartItems() {
  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  const parsed = safeJsonParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function getCartTotals(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => {
    const unitPrice = parseMoneyToNumber(item?.price);
    const qtyNum = Number.parseInt(String(item?.quantity ?? "1"), 10);
    const safeQty = Number.isNaN(qtyNum) ? 1 : Math.max(1, qtyNum);
    return sum + unitPrice * safeQty;
  }, 0);

  const shipping = SHIPPING_AMOUNT;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

function getCheckoutState() {
  const raw = window.localStorage.getItem(CHECKOUT_STORAGE_KEY);
  const parsed = safeJsonParse(raw, null);
  if (!parsed || typeof parsed !== "object") {
    return {
      currentStep: STEPS.SHIPPING,
      formData: {},
    };
  }

  const currentStep = Number(parsed.currentStep) || STEPS.SHIPPING;
  const formData = parsed.formData && typeof parsed.formData === "object" ? parsed.formData : {};

  return { currentStep, formData };
}

function setCheckoutState(next) {
  window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(next));
}

function setCurrentStep(step) {
  const state = getCheckoutState();
  setCheckoutState({ currentStep: step, formData: state.formData });
}

function maskPaymentMethod(cardNumberRaw) {
  const digits = String(cardNumberRaw ?? "").replace(/\D/g, "");
  const last4 = digits.slice(-4);
  if (last4.length !== 4) return "Card ending in ____";
  const brandGuess = (() => {
    const first = digits[0];
    if (first === "4") return "Visa";
    if (first === "5") return "Mastercard";
    return "Card";
  })();
  return `${brandGuess} ending in ${last4}`;
}

function ensureGate(requiredStep) {
  const state = getCheckoutState();
  if (state.currentStep !== requiredStep) {
    // Redirect to the correct page based on the stored step
    if (state.currentStep <= STEPS.SHIPPING) {
      window.location.href = "Checkout1.html";
    } else if (state.currentStep === STEPS.PAYMENT) {
      window.location.href = "Checkout2.html";
    } else {
      window.location.href = "Checkout3.html";
    }
    return false;
  }
  return true;
}

function clearErrors(container) {
  const errors = container.querySelectorAll("[data-error-for]");
  errors.forEach((el) => {
    el.textContent = "";
    el.style.display = "none";
  });
}

function setFieldError(inputEl, message) {
  const errorId = inputEl.getAttribute("data-error-for");
  if (!errorId) return;

  const errorEl = document.querySelector(`[data-error-for="${errorId}"]`);
  if (!errorEl) return;

  errorEl.textContent = message;
  errorEl.style.display = "block";
}

function isNonEmpty(value) {
  return String(value ?? "").trim().length > 0;
}

function validateEmail(email) {
  const v = String(email ?? "").trim();
  // Simple, reasonable client-side check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validateShippingForm() {
  const form = document.querySelector(".shipping-form");
  if (!form) return { ok: false, errors: {} };

  const email = form.querySelector("#shipEmail")?.value ?? "";
  const firstName = form.querySelector("#shipFirstName")?.value ?? "";
  const lastName = form.querySelector("#shipLastName")?.value ?? "";
  const address1 = form.querySelector("#shipAddress1")?.value ?? "";
  const city = form.querySelector("#shipCity")?.value ?? "";
  const state = form.querySelector("#shipState")?.value ?? "";
  const zip = form.querySelector("#shipZip")?.value ?? "";
  const country = form.querySelector("#shipCountry")?.value ?? "";

  const errors = {};

  if (!isNonEmpty(email)) errors.shipEmail = "Email is required.";
  else if (!validateEmail(email)) errors.shipEmail = "Email is invalid.";

  if (!isNonEmpty(firstName)) errors.shipFirstName = "First name is required.";
  if (!isNonEmpty(lastName)) errors.shipLastName = "Last name is required.";
  if (!isNonEmpty(address1)) errors.shipAddress1 = "Address is required.";
  if (!isNonEmpty(city)) errors.shipCity = "City is required.";
  if (!isNonEmpty(state)) errors.shipState = "State is required.";

  if (!isNonEmpty(zip)) errors.shipZip = "ZIP code is required.";
  else if (!/^\d{4,10}$/.test(String(zip).trim())) errors.shipZip = "ZIP code is invalid.";

  if (!isNonEmpty(country)) errors.shipCountry = "Country is required.";

  return { ok: Object.keys(errors).length === 0, errors };
}

function validatePaymentForm() {
  const form = document.querySelector(".payment-form");
  if (!form) return { ok: false, errors: {} };

  const cardholderName = form.querySelector("#payCardholderName")?.value ?? "";
  const cardNumber = form.querySelector("#payCardNumber")?.value ?? "";
  const expiry = form.querySelector("#payExpiry")?.value ?? "";
  const cvv = form.querySelector("#payCvv")?.value ?? "";

  const billingSame = form.querySelector("#billingSameAsShipping")?.checked ?? true;

  const billingAddress1 = form.querySelector("#billAddress1")?.value ?? "";
  const billingCity = form.querySelector("#billCity")?.value ?? "";
  const billingState = form.querySelector("#billState")?.value ?? "";
  const billingZip = form.querySelector("#billZip")?.value ?? "";
  const billingCountry = form.querySelector("#billCountry")?.value ?? "";

  const errors = {};

  if (!isNonEmpty(cardholderName)) errors.payCardholderName = "Cardholder name is required.";

  const digits = String(cardNumber).replace(/\D/g, "");
  if (!isNonEmpty(cardNumber)) errors.payCardNumber = "Card number is required.";
  else if (digits.length < 12) errors.payCardNumber = "Credit card number is incomplete.";

  if (!isNonEmpty(expiry)) errors.payExpiry = "Expiry date is required.";
  else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(String(expiry).trim()))
    errors.payExpiry = "Expiry date must be in MM/YY format.";

  const cvvTrim = String(cvv).trim();
  if (!isNonEmpty(cvv)) errors.payCvv = "CVV is required.";
  else if (!/^\d{3,4}$/.test(cvvTrim)) errors.payCvv = "CVV/CVC must be 3 or 4 digits.";

  if (!billingSame) {
    if (!isNonEmpty(billingAddress1)) errors.billAddress1 = "Billing address is required.";
    if (!isNonEmpty(billingCity)) errors.billCity = "Billing city is required.";
    if (!isNonEmpty(billingState)) errors.billState = "Billing state is required.";
    if (!isNonEmpty(billingZip)) errors.billZip = "Billing ZIP code is required.";
    else if (!/^\d{4,10}$/.test(String(billingZip).trim()))
      errors.billZip = "Billing ZIP code is invalid.";
    if (!isNonEmpty(billingCountry)) errors.billCountry = "Billing country is required.";
  }

  return { ok: Object.keys(errors).length === 0, errors, billingSame };
}

function renderFieldErrors(rootEl, errors) {
  Object.entries(errors).forEach(([fieldKey, message]) => {
    const input = rootEl.querySelector(`[data-field-key="${fieldKey}"]`);
    if (input) {
      const errorHost = document.querySelector(`[data-error-for="${fieldKey}"]`);
      if (errorHost) {
        errorHost.textContent = message;
        errorHost.style.display = "block";
      }
    } else {
      const errorHost = document.querySelector(`[data-error-for="${fieldKey}"]`);
      if (errorHost) {
        errorHost.textContent = message;
        errorHost.style.display = "block";
      }
    }
  });
}

function collectShippingFormData() {
  const form = document.querySelector(".shipping-form");
  if (!form) return {};

  return {
    email: form.querySelector("#shipEmail")?.value ?? "",
    firstName: form.querySelector("#shipFirstName")?.value ?? "",
    lastName: form.querySelector("#shipLastName")?.value ?? "",
    address1: form.querySelector("#shipAddress1")?.value ?? "",
    city: form.querySelector("#shipCity")?.value ?? "",
    state: form.querySelector("#shipState")?.value ?? "",
    zip: form.querySelector("#shipZip")?.value ?? "",
    country: form.querySelector("#shipCountry")?.value ?? "",
  };
}

function collectPaymentFormData() {
  const form = document.querySelector(".payment-form");
  if (!form) return {};

  const billingSame = form.querySelector("#billingSameAsShipping")?.checked ?? true;

  return {
    cardholderName: form.querySelector("#payCardholderName")?.value ?? "",
    cardNumber: form.querySelector("#payCardNumber")?.value ?? "",
    expiry: form.querySelector("#payExpiry")?.value ?? "",
    cvv: form.querySelector("#payCvv")?.value ?? "",
    billingSameAsShipping: billingSame,
    billingAddress1: form.querySelector("#billAddress1")?.value ?? "",
    billingCity: form.querySelector("#billCity")?.value ?? "",
    billingState: form.querySelector("#billState")?.value ?? "",
    billingZip: form.querySelector("#billZip")?.value ?? "",
    billingCountry: form.querySelector("#billCountry")?.value ?? "",
  };
}

function prefillShipping(formData) {
  const form = document.querySelector(".shipping-form");
  if (!form) return;

  form.querySelector("#shipEmail").value = formData?.email ?? "";
  form.querySelector("#shipFirstName").value = formData?.firstName ?? "";
  form.querySelector("#shipLastName").value = formData?.lastName ?? "";
  form.querySelector("#shipAddress1").value = formData?.address1 ?? "";
  form.querySelector("#shipCity").value = formData?.city ?? "";
  form.querySelector("#shipState").value = formData?.state ?? "";
  form.querySelector("#shipZip").value = formData?.zip ?? "";
  form.querySelector("#shipCountry").value = formData?.country ?? "United States";
}

function prefillPayment(formData) {
  const form = document.querySelector(".payment-form");
  if (!form) return;

  form.querySelector("#payCardholderName").value = formData?.cardholderName ?? "";
  form.querySelector("#payCardNumber").value = formData?.cardNumber ?? "";
  form.querySelector("#payExpiry").value = formData?.expiry ?? "";
  form.querySelector("#payCvv").value = formData?.cvv ?? "";

  const billingSame = formData?.billingSameAsShipping ?? true;
  form.querySelector("#billingSameAsShipping").checked = Boolean(billingSame);

  form.querySelector("#billAddress1").value = formData?.billingAddress1 ?? "";
  form.querySelector("#billCity").value = formData?.billingCity ?? "";
  form.querySelector("#billState").value = formData?.billingState ?? "";
  form.querySelector("#billZip").value = formData?.billingZip ?? "";
  form.querySelector("#billCountry").value = formData?.billingCountry ?? "United States";

  const addressBlock = form.querySelector(".billing-address-block");
  if (addressBlock) {
    addressBlock.style.display = billingSame ? "none" : "flex";
  }
}

function setupBillingToggle() {
  const form = document.querySelector(".payment-form");
  if (!form) return;

  const checkbox = form.querySelector("#billingSameAsShipping");
  if (!checkbox) return;

  const addressBlock = form.querySelector(".billing-address-block");
  if (!addressBlock) return;

  const apply = () => {
    addressBlock.style.display = checkbox.checked ? "none" : "flex";
  };

  checkbox.addEventListener("change", apply);
  apply();
}

function disableButton(btn, disabled) {
  if (!btn) return;
  btn.disabled = disabled;
  btn.style.opacity = disabled ? "0.65" : "1";
  btn.style.cursor = disabled ? "not-allowed" : "pointer";
}

function renderReviewPage() {
  const state = getCheckoutState();
  const formData = state.formData ?? {};

  const shipping = formData.shipping ?? {};
  const payment = formData.payment ?? {};

  const shipName = [shipping.firstName, shipping.lastName].filter(Boolean).join(" ");
  const shipLines = [shipping.address1, shipping.city, shipping.state, shipping.country].filter(Boolean);

  // Shipping
  const shippingEl = document.querySelector('[data-review="shipping"]');
  if (shippingEl) {
    const shipNameEl = shippingEl.querySelector('[data-review="ship-name"]');
    const shipLine1El = shippingEl.querySelector('[data-review="ship-line-1"]');
    const shipLine2El = shippingEl.querySelector('[data-review="ship-line-2"]');
    const shipLine3El = shippingEl.querySelector('[data-review="ship-line-3"]');
    const shipLine4El = shippingEl.querySelector('[data-review="ship-line-4"]');

    if (shipNameEl) shipNameEl.textContent = shipName || "—";
    if (shipLine1El) shipLine1El.textContent = shipLines[0] || "—";
    if (shipLine2El) shipLine2El.textContent = shipLines[1] || "—";
    if (shipLine3El) shipLine3El.textContent = shipLines[2] || "—";
    if (shipLine4El) shipLine4El.textContent = shipLines[3] || "—";
  }

  // Payment masked
  const payEl = document.querySelector('[data-review="payment"]');
  if (payEl) {
    const paymentMaskEl = payEl.querySelector('[data-review="payment-mask"]');
    if (paymentMaskEl) paymentMaskEl.textContent = maskPaymentMethod(payment.cardNumber);
  }

  // Line items + totals
  const cartItems = getCartItems();
  const { subtotal, shipping: shippingAmt, tax, total } = getCartTotals(cartItems);

  const itemsContainer = document.querySelector('[data-review="items"]');
  if (itemsContainer) {
    itemsContainer.innerHTML = "";
    cartItems.forEach((item) => {
      const name = String(item?.name ?? "Item");
      const unitPrice = parseMoneyToNumber(item?.price);
      const qtyNum = Number.parseInt(String(item?.quantity ?? "1"), 10);
      const safeQty = Number.isNaN(qtyNum) ? 1 : Math.max(1, qtyNum);
      const lineTotal = unitPrice * safeQty;

      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `<span>${name} x ${safeQty}</span><span>${formatMoney(lineTotal)}</span>`;
      itemsContainer.appendChild(row);
    });
  }

  const rightPanel = document.querySelector(".right-panel");

  const subtotalEl = rightPanel?.querySelector('[data-review="subtotal"]');
  const shipEl = rightPanel?.querySelector('[data-review="shipping"]');
  const taxEl = rightPanel?.querySelector('[data-review="tax"]');
  const totalEl = rightPanel?.querySelector('[data-review="total"]');

  if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
  if (shipEl) shipEl.textContent = shippingAmt === 0 ? "FREE" : formatMoney(shippingAmt);
  if (taxEl) taxEl.textContent = formatMoney(tax);
  if (totalEl) totalEl.textContent = formatMoney(total);

  // Continue shopping button
  const continueBtn = document.querySelector('[data-action="continue-shopping"]');
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      window.location.href = "shop.html";
    });
  }
}

function placeOrderOnce() {
  // Single-fire guard
  const alreadyPlaced = window.localStorage.getItem(CHECKOUT_PLACED_KEY) === "true";
  if (alreadyPlaced) return { ok: false, reason: "alreadyPlaced" };

  window.localStorage.setItem(CHECKOUT_PLACED_KEY, "true");

  // Fake transaction processing: in real life this would be an API call.
  const delay = (ms) => new Promise((res) => window.setTimeout(res, ms));
  return delay(1200).then(() => ({ ok: true }));
}

function setupShippingPage() {
  if (!ensureGate(STEPS.SHIPPING)) return;

  const state = getCheckoutState();
  const shippingData = state.formData?.shipping ?? {};

  const form = document.querySelector(".shipping-form");
  const continueBtn = document.querySelector(".btn-continue");
  if (!form || !continueBtn) return;

  prefillShipping(shippingData);

  form.addEventListener("input", () => {
    const next = collectShippingFormData();
    const currentState = getCheckoutState();
    setCheckoutState({ currentStep: STEPS.SHIPPING, formData: { ...currentState.formData, shipping: next } });
  });

  continueBtn.addEventListener("click", async () => {
    const { ok, errors } = validateShippingForm();

    // Disable Next (hard block)
    disableButton(continueBtn, true);

    // Clear previous errors
    const errorHosts = document.querySelectorAll('[data-error-for^="ship"]');
    errorHosts.forEach((el) => {
      el.textContent = "";
      el.style.display = "none";
    });

    if (!ok) {
      renderFieldErrors(form, errors);
      disableButton(continueBtn, false);
      return;
    }

    // Persist & advance
    const nextShipping = collectShippingFormData();
    const currentState = getCheckoutState();
    setCheckoutState({
      currentStep: STEPS.PAYMENT,
      formData: { ...currentState.formData, shipping: nextShipping },
    });

    window.location.href = "Checkout2.html";
  });
}

function setupPaymentPage() {
  if (!ensureGate(STEPS.PAYMENT)) return;

  const state = getCheckoutState();
  const shippingData = state.formData?.shipping ?? {};
  const paymentData = state.formData?.payment ?? {};

  const form = document.querySelector(".payment-form");
  const reviewBtn = document.querySelector(".btn-review");
  if (!form || !reviewBtn) return;

  // Billing same checkbox toggle
  setupBillingToggle();

  // Prefill
  prefillPayment(paymentData);

  // Live persist on input
  form.addEventListener("input", () => {
    const next = collectPaymentFormData();
    const currentState = getCheckoutState();
    setCheckoutState({ currentStep: STEPS.PAYMENT, formData: { ...currentState.formData, payment: next, shipping: shippingData } });
  });

  reviewBtn.addEventListener("click", () => {
    // Clear previous errors
    const errorHosts = document.querySelectorAll('[data-error-for^="pay"], [data-error-for^="bill"]');
    errorHosts.forEach((el) => {
      el.textContent = "";
      el.style.display = "none";
    });

    const { ok, errors } = validatePaymentForm();
    disableButton(reviewBtn, true);

    if (!ok) {
      renderFieldErrors(form, errors);
      disableButton(reviewBtn, false);
      return;
    }

    const nextPayment = collectPaymentFormData();
    const currentState = getCheckoutState();

    setCheckoutState({
      currentStep: STEPS.REVIEW,
      formData: { ...currentState.formData, payment: nextPayment, shipping: shippingData },
    });

    window.location.href = "Checkout3.html";
  });

  // Back button
  const backBtn = document.querySelector(".btn-back");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      setCurrentStep(STEPS.SHIPPING);
      window.location.href = "Checkout1.html";
    });
  }
}

function setupReviewPage() {
  const state = getCheckoutState();

  if (!state.formData?.shipping || !state.formData?.payment) {
    // Missing required data, force step reset to shipping for recovery
    setCheckoutState({ currentStep: STEPS.SHIPPING, formData: state.formData ?? {} });
    window.location.href = "Checkout1.html";
    return;
  }

  renderReviewPage();

  // Back button
  const backBtn = document.querySelector(".btn-back");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      setCurrentStep(STEPS.PAYMENT);
      window.location.href = "Checkout2.html";
    });
  }

  // Place order button (only fire once)
  const placeBtn = document.querySelector('[data-action="place-order"]');
  if (!placeBtn) return;

  placeBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    disableButton(placeBtn, true);
    const originalText = placeBtn.textContent;
    placeBtn.textContent = "Processing...";

    try {
      const res = await placeOrderOnce();
      if (!res.ok) {
        // If already placed, just continue to success
        window.location.href = SUCCESS_PAGE;
        return;
      }

      // Snapshot receipt items before clearing cart (so Success page can render receipt)
      const receiptItems = getCartItems();
      window.localStorage.setItem("lastReceipt", JSON.stringify(receiptItems));

      // Clear cart after successful placement
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));

      // Generate order number and store
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const rand = (len) => Array.from({ length: len }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
      const digits = Math.floor(100 + Math.random() * 900);
      const orderNumber = `#${rand(3)}-${digits}`;

      window.localStorage.setItem("lastOrderNumber", orderNumber);

      // Redirect to success
      window.location.href = SUCCESS_PAGE;
    } finally {
      placeBtn.textContent = originalText;
      disableButton(placeBtn, false);
    }
  });
}

// Router: load correct setup based on page
document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.split("/").pop();

  if (page === "Checkout1.html") setupShippingPage();
  if (page === "Checkout2.html") setupPaymentPage();
  if (page === "Checkout3.html") setupReviewPage();

    // Success page: render order number + receipt info
  if (page === SUCCESS_PAGE) {
    const number = window.localStorage.getItem("lastOrderNumber") || "—";
    const email = (getCheckoutState().formData?.shipping?.email ?? "").trim();

    const state = getCheckoutState();
    const shippingData = state.formData?.shipping ?? {};
    const paymentData = state.formData?.payment ?? {};

    const cartItems = getCartItems(); // likely already cleared, so use stored receipt snapshot if present
    // We'll fallback to "receipt" from storage if cart is cleared; best-effort.
    const receipt = window.localStorage.getItem("lastReceipt");
    const receiptItems = receipt ? safeJsonParse(receipt, []) : cartItems;

    // If cart cleared, we need the receipt items. We'll reconstruct from checkout state if possible.
    // For now, if empty, show a message.
    const orderNoEl = document.querySelector('[data-success="order-number"]');
    if (orderNoEl) orderNoEl.textContent = number;

    const emailEl = document.querySelector('[data-success="email"]');
    if (emailEl) emailEl.textContent = email || "your email";

    const shippingAddrEl = document.querySelector('[data-success="shipping-address"]');
    if (shippingAddrEl) {
      const addressParts = [
        shippingData?.address1,
        shippingData?.city,
        shippingData?.state,
        shippingData?.country,
      ].filter(Boolean);

      shippingAddrEl.textContent = addressParts.length ? addressParts.join(", ") : "—";
    }

    const paymentMethodEl = document.querySelector('[data-success="payment-method"]');
    if (paymentMethodEl) {
      const masked = maskPaymentMethod(paymentData?.cardNumber);
      paymentMethodEl.textContent = masked || "—";
    }

    const receiptContainer = document.querySelector('[data-success="receipt-items"]');
    if (receiptContainer) {
      receiptContainer.innerHTML = "";
      if (Array.isArray(receiptItems) && receiptItems.length > 0) {
        const { total } = getCartTotals(receiptItems);
        receiptItems.forEach((item) => {
          const name = String(item?.name ?? "Item");
          const unitPrice = parseMoneyToNumber(item?.price);
          const qtyNum = Number.parseInt(String(item?.quantity ?? "1"), 10);
          const safeQty = Number.isNaN(qtyNum) ? 1 : Math.max(1, qtyNum);
          const lineTotal = unitPrice * safeQty;

          const row = document.createElement("div");
          row.className = "receipt-row";
          row.innerHTML = `<span>${name} x ${safeQty}</span><span>${formatMoney(lineTotal)}</span>`;
          receiptContainer.appendChild(row);
        });

        const receiptTotalEl = document.querySelector('[data-success="receipt-total"]');
        if (receiptTotalEl) receiptTotalEl.textContent = formatMoney(total);
      } else {
        const empty = document.createElement("div");
        empty.style.fontSize = "0.9rem";
        empty.style.color = "#333";
        empty.textContent = "Receipt details will appear here shortly.";
        receiptContainer.appendChild(empty);
      }
    }

    const continueBtn = document.querySelector('[data-success="continue-shopping"]');
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        window.location.href = "shop.html";
      });
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('shipCountry');
    
    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    countries.forEach(country => {
        const opt = document.createElement('option');
        opt.value = country;
        opt.textContent = country;
        countrySelect.appendChild(opt);
    });
});