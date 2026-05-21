// 1. PRODUCT DATA OBJECT
// Keys MUST match the `data-slug` values used in shop.html product cards.
const products = {
  // SUPPLEMENTS
  "whey-protein-isolate": {
    name: "WHEY PROTEIN ISOLATE",
    category: "Supplements",
    sub: "Protein Powders",
    price: "$49.99",
    reviews: "324",
    img: "images/wheypretein.avif",
    description: "High-quality whey isolate for fast recovery.",
    shipping: "Free shipping on orders over $75.",
  },
  "plant-based-protein-shake": {
    name: "PLANT-BASED PROTIEN SHAKE",
    category: "Supplements",
    sub: "Protein Powders",
    price: "$39.99",
    reviews: "194",
    img: "images/Proteina-Vegetal-Premium-Birdman-Falcon-Performance-Choco-Bronze-1_14-kg (1).jpg",
    description: "Vegan-friendly protein blend.",
    shipping: "Free shipping on orders over $75.",
  },
  "casein-protein": {
    name: "CASEIN PROTEIN",
    category: "Supplements",
    sub: "Protein Powders",
    price: "$54.99",
    reviews: "156",
    img: "images/R1 Casein - 4lb _ Strawberries & Creme (1).jpg",
    description: "Slow-digesting protein for overnight recovery.",
    shipping: "Standard shipping rates apply.",
  },
  "bcaa-complex": {
    name: "BCAA COMPLEX",
    category: "Supplements",
    sub: "Recovery and Amino Acids",
    price: "$29.99",
    reviews: "267",
    img: "images/bcaacomplex.webp",
    description: "Essential amino acids for muscle endurance.",
    shipping: "Standard shipping rates apply.",
  },
  "glutamine-powder": {
    name: "GLUTAMINE POWDER",
    category: "Supplements",
    sub: "Recovery and Amino Acids",
    price: "$49.99",
    reviews: "142",
    img: "images/glutamine.jpg",
    description: "Supports gut health and muscle repair.",
    shipping: "Standard shipping rates apply.",
  },
  "pre-workout-energy": {
    name: "PRE-WORKOUT ENERGY",
    category: "Supplements",
    sub: "Pre-Workout & Energy",
    price: "$39.99",
    reviews: "412",
    img: "images/💪 VITASTRONG Pre-Workout.jpg",
    description: "Explosive energy and focus for your sessions.",
    shipping: "Free shipping on orders over $75.",
  },
  "stim-free-pre-workout": {
    name: "STIM-FREE PRE-WORKOUT",
    category: "Supplements",
    sub: "Pre-Workout & Energy",
    price: "$34.99",
    reviews: "223",
    img: "images/stim.jpg",
    description: "Focus and pump without the caffeine jitters.",
    shipping: "Standard shipping rates apply.",
  },

  // APPAREL
  "performance-training-tee": {
    name: "PERFORMANCE TRAINING TEE",
    category: "Apparel",
    sub: "Tops & T-Shirts",
    price: "$29.99",
    reviews: "189",
    img: "images/apparel1.jpg",
    description: "Moisture-wicking fabric for intense workouts.",
    shipping: "Standard shipping rates apply.",
  },
  "essential-training-tank": {
    name: "ESSENTIAL TRAINING TANK",
    category: "Apparel",
    sub: "Tops & T-Shirts",
    price: "$19.99",
    reviews: "267",
    img: "images/apparel2.jpg",
    description: "Breathable tank for maximum mobility.",
    shipping: "Standard shipping rates apply.",
  },
  "training-joggers": {
    name: "TRAINING JOGGERS",
    category: "Apparel",
    sub: "Bottoms",
    price: "$54.99",
    reviews: "156",
    img: "images/apparel3.jpg",
    description: "Tapered fit for style and comfort.",
    shipping: "Standard shipping rates apply.",
  },
  "athletic-shorts": {
    name: "ATHLETIC SHORTS",
    category: "Apparel",
    sub: "Bottoms",
    price: "$29.99",
    reviews: "287",
    img: "images/apparel4.jpg",
    description: "Lightweight shorts for any activity.",
    shipping: "Standard shipping rates apply.",
  },
  "performance-jacket": {
    name: "PERFORMANCE JACKET",
    category: "Apparel",
    sub: "Outerwear",
    price: "$89.99",
    reviews: "156",
    img: "images/apparel5.jpg",
    description: "Weather-resistant jacket for outdoor training.",
    shipping: "Free shipping included.",
  },
  "training-cap": {
    name: "TRAINING CAP",
    category: "Apparel",
    sub: "Accessories & Headwear",
    price: "$19.99",
    reviews: "89",
    img: "images/apparel6.jpg",
    description: "Keep your cool with this breathable cap.",
    shipping: "Standard shipping rates apply.",
  },

  // EQUIPMENT
  "adjustable-dumbbells": {
    name: "ADJUSTABLE DUMBBELLS",
    category: "Equipment",
    sub: "Weights",
    price: "$34.99",
    reviews: "523",
    img: "images/equipment1.jpg",
    description: "Space-saving weights for home gyms.",
    shipping: "Heavy item: Extra shipping fees may apply.",
  },
  "hex-dumbbells-set": {
    name: "HEX DUMBBELLS SET",
    category: "Equipment",
    sub: "Weights",
    price: "$149.99",
    reviews: "234",
    img: "images/equipment2.jpg",
    description: "Hex dumbbells for stability and safety.",
    shipping: "Heavy item: Extra shipping fees may apply.",
  },
  "resistance-band-set": {
    name: "RESISTANCE BAND SET",
    category: "Equipment",
    sub: "Resistance and Body Weights",
    price: "$39.99",
    reviews: "412",
    img: "images/equipment3.jpg",
    description: "Full-body workout set you can take anywhere.",
    shipping: "Standard shipping rates apply.",
  },
  "foam-roller-pro": {
    name: "FOAM ROLLER PRO",
    category: "Equipment",
    sub: "Recovery Tools",
    price: "$44.99",
    reviews: "298",
    img: "images/equipment4.jpg",
    description: "Deep tissue recovery for sore muscles.",
    shipping: "Standard shipping rates apply.",
  },
  "massage-gun": {
    name: "MASSAGE GUN",
    category: "Equipment",
    sub: "Recovery Tools",
    price: "$49.99",
    reviews: "187",
    img: "images/equipment5.jpg",
    description: "Percussive therapy for fast muscle relief.",
    shipping: "Free shipping included.",
  },
};


// Wrap the click binder in DOMContentLoaded so it waits for the HTML cards to load first
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-card");
  
  cards.forEach((card) => {
    card.style.cursor = "pointer"; // Makes it look clickable (changes mouse to a hand)

    if (card.dataset.boundClick === "true") return;
    card.dataset.boundClick = "true";

    // When the user clicks ANYWHERE inside this card...
    card.addEventListener("click", () => {
      const slug = card.getAttribute("data-slug");
      
      if (!slug) {
        console.error("Missing data-slug on this card!");
        return;
      }

      // ...send them to the details page with the correct product ID!
      window.location.href = `Product.Details.html?id=${encodeURIComponent(slug)}`;
    });
  });
});

// 3. PRODUCT DETAILS LOGIC
document.addEventListener("DOMContentLoaded", () => {
  // Only run if we are on the details page and have the expected elements
  if (!document.querySelector(".product-title")) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = productId ? products[productId] : undefined;

  if (!product) {
    // Keep placeholders as-is; don’t crash.
    return;
  }

  // Populate Page Content
  const titleEl = document.querySelector(".product-title");
  const subtitleEl = document.querySelector(".product-subtitle");
  const mainImageEl = document.querySelector(".main-image");
  const reviewCountEl = document.querySelector(".review-count");
  const breadcrumbs = document.querySelector(".breadcrumbs");

  if (titleEl) titleEl.innerText = product.name;
  if (subtitleEl) subtitleEl.innerText = product.sub;
  if (mainImageEl) mainImageEl.style.backgroundImage = `url('${product.img}')`;
  if (reviewCountEl) reviewCountEl.innerText = `(${product.reviews} reviews)`;

  // Breadcrumbs
  if (breadcrumbs) {
    breadcrumbs.innerHTML = `Home > ${product.category} > ${product.sub} > ${product.name}`;
  }

  // Price (details page uses .product-details markup but CSS has no .product-price by default)
  const priceEl = document.querySelector(".product-price") || document.querySelector(".price");
  if (priceEl) priceEl.innerText = product.price;

  // Initial Tab Content
  const tabContentP = document.querySelector(".tab-content p");
  if (tabContentP) tabContentP.innerText = product.description;

  // Tab Switching Logic
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      if (!tabContentP) return;

      const label = tab.innerText.trim().toUpperCase();
      if (label === "DESCRIPTION") tabContentP.innerText = product.description;
      if (label === "REVIEWS")
        tabContentP.innerText = `Rated 4.8/5 by our athletes based on ${product.reviews} reviews.`;
      if (label === "SHIPPING") tabContentP.innerText = product.shipping;
    });
  });

  // Quantity + Cart Logic
  const qtyInput = document.querySelector(".quantity-box input");
  const plusBtn = document.querySelector(".plus");
  const minusBtn = document.querySelector(".minus");
  const addToCartBtn = document.querySelector(".add-to-cart");

  const getQty = () => {
    const raw = qtyInput?.value ?? "1";
    const parsed = Number.parseInt(String(raw), 10);
    return Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
  };

  const setQty = (next) => {
    if (!qtyInput) return;
    const safe = Math.max(1, Math.floor(next));
    qtyInput.value = String(safe);
  };

  if (plusBtn && minusBtn && qtyInput) {
    plusBtn.onclick = () => setQty(getQty() + 1);
    minusBtn.onclick = () => setQty(getQty() - 1);
  }

  if (addToCartBtn && qtyInput) {
    addToCartBtn.addEventListener("click", () => {
      const order = {
        id: productId,
        name: product.name,
        price: product.price,
        quantity: String(getQty()),
        img: product.img,
      };

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push(order);
      localStorage.setItem("cart", JSON.stringify(cart));

      window.location.href = "chartandcheckout.html";
    });
  }
});
