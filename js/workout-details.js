(function () {
  const WORKOUT_PARAM_KEY = "workout";
  const CLASS_PARAM_KEY = "class";

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  const normalizeTitle = (raw) => String(raw || "").trim();

  // Normalize incoming titles from either:
  // - workout plans (workout-details.html?workout=...)
  // - classes (workout-details.html?class=...)
  const normalizeWorkoutTitleToKey = (rawTitle) => {
    const title = normalizeTitle(rawTitle);
    if (!title) return null;

    const map = [
      // WORKOUT PLANS
      "7 Days Quick Start",
      "10 Days Challenge",
      "For Busy Professionals",
      "30 Days Challenge",
      "Fat Burn Program",

      // CLASSES (from classes.html)
      "Strength Training",
      "Aerobic Power",
      "Flexibility and Balance",
      "HIIT Boot Camp",
    ];

    // Exact match first
    for (const t of map) {
      if (t === title) return t;
    }

    // Case-insensitive match
    const lower = title.toLowerCase();
    for (const t of map) {
      if (t.toLowerCase() === lower) return t;
    }

    return null;
  };

  const WORKOUTS = {
    // WORKOUT PLANS
    "7 Days Quick Start": {
      duration: "7 Days",
      difficulty: "Beginner",
      description:
        "A fast kickoff to build consistent habits and confidence. You’ll start with foundational strength and simple conditioning to get momentum in your very first week.",
      sampleRoutine:
        "Day 1: Full-Body Basics (squats, push-ups, rows, planks)\nDay 2: Core + Mobility (dead bugs, side planks, stretching)\nDay 3: Lower Focus (hinges, lunges, glute bridges)\nDay 4: Upper Focus (push + pull variations)\nDay 5: Cardio Finisher (brisk intervals + easy cooldown)\nDay 6: Active Recovery (walk + gentle mobility)\nDay 7: Form Review + Easy Strength Circuit",
      benefits: "Build consistency • Improve movement form • Boost energy • Strengthen core",
      price: 29.99,
    },
    "10 Days Challenge": {
      duration: "10 Days",
      difficulty: "Intermediate",
      description:
        "A short, structured challenge designed to push endurance and strength. Expect progressive effort, tighter rest control, and workouts that feel challenging but achievable.",
      sampleRoutine:
        "Day 1: Strength Foundation (lower + push)\nDay 2: Cardio Intervals (timed bursts)\nDay 3: Upper Pull + Core\nDay 4: Total-Body Circuit (density day)\nDay 5: Lower Strength (hinge + lunge)\nDay 6: Conditioning + Mobility\nDay 7: Rest / light walk\nDay 8: Strength + Core Combo\nDay 9: Cardio finisher\nDay 10: Full-Body Wrap-Up + stretch",
      benefits: "Higher stamina • Stronger full-body • Better work capacity • Improved recovery routine",
      price: 39.99,
    },
    "For Busy Professionals": {
      duration: "4 Weeks",
      difficulty: "All Levels",
      description:
        "Minimal-time workouts (20–30 minutes) built for busy schedules. You’ll alternate focus blocks to maintain progress without needing long sessions.",
      sampleRoutine:
        "Week 1–2 A/B:\nA: Quick Upper + Core (push/pull + plank variations)\nB: Quick Lower + Conditioning (squat/hinge + short bursts)\nWeek 3: Add tempo (slower controlled reps)\nWeek 4: Consolidation week (slightly lighter, cleaner form)\nEvery session ends with 3–5 minutes mobility + breathing.",
      benefits: "Save time • Stay consistent • Build lean strength • Improve conditioning",
      price: 49.99,
    },
    "30 Days Challenge": {
      duration: "30 Days",
      difficulty: "Advanced",
      description:
        "A full 30-day transformation arc for maximum strength gains and muscular endurance. You’ll progress weekly with clearer intensity targets.",
      sampleRoutine:
        "Weekly pattern:\nMon: Lower Strength\nTue: Upper Strength + Core\nWed: Conditioning + Mobility\nThu: Full Body Hypertrophy Circuit\nFri: Cardio intervals + posture work\nSat: Accessory Strength (shoulders/back/arms)\nSun: Rest\nProgression: increase load or rep range every week, keep technique locked.",
      benefits: "Noticeable muscle gain • Stronger joints • Better posture • High conditioning level",
      price: 59.99,
    },
    "Fat Burn Program": {
      duration: "8 Weeks",
      difficulty: "Intermediate",
      description:
        "A fat-loss focused program combining HIIT-style conditioning with strength work. Designed to increase calorie burn while preserving muscle.",
      sampleRoutine:
        "Week 1–2:\n3× Strength days + 2× HIIT conditioning\nWeek 3–6:\nAdd longer strength sets + shorter HIIT intervals\nWeek 7–8:\nPeak week then taper (reduce volume slightly)\nTypical session: warm-up → compound strength → HIIT finisher → cooldown mobility.",
      benefits: "Weight-loss support • Improved cardiovascular fitness • Better muscle endurance • Faster recovery habits",
      price: 69.99,
    },

    // CLASSES (from classes.html per-class prices)
    "Strength Training": {
      duration: "60 min",
      difficulty: "Intermediate",
      description:
        "Join expert-led group strength training with guided technique and progressive work for the whole body.",
      sampleRoutine:
        "Warm-up → Compound strength (lower + push) → Accessory work → Finisher → Cooldown mobility",
      benefits: "Build strength • Improve form • Train with community",
      price: 25,
    },
    "Aerobic Power": {
      duration: "45 min",
      difficulty: "All Levels",
      description:
        "Boost cardiovascular conditioning with energizing cardio intervals and athletic-style bursts.",
      sampleRoutine:
        "Warm-up → Interval set → Core stabilization → Conditioning finisher → Cooldown",
      benefits: "Endurance • Heart health • Better work capacity",
      price: 20,
    },
    "Flexibility and Balance": {
      duration: "50 min",
      difficulty: "Beginner",
      description:
        "Improve mobility, flexibility, and balance through guided stretching and stability exercises.",
      sampleRoutine:
        "Mobility flow → Stability drills → Stretch blocks → Balance finisher → Long cooldown",
      benefits: "Mobility • Injury prevention • Mind-body connection",
      price: 22,
    },
    "HIIT Boot Camp": {
      duration: "45 min",
      difficulty: "Advanced",
      description:
        "High-intensity interval training combining strength + cardio for maximum calorie burn and athletic performance.",
      sampleRoutine:
        "Warm-up → Strength HIIT rounds → Cardio intervals → Core finisher → Cooldown",
      benefits: "Calorie burn • Conditioning • Stronger fitness foundation",
      price: 28,
    },
  };

  const main = () => {
    const params = new URLSearchParams(window.location.search);

    // IMPORTANT: classes.html uses ?class=..., while workout plans use ?workout=...
    const rawWorkout = params.get(WORKOUT_PARAM_KEY);
    const rawClass = params.get(CLASS_PARAM_KEY);

    const rawSelection = rawWorkout ?? rawClass;
    const workoutKey = normalizeWorkoutTitleToKey(rawSelection);

    const data = workoutKey ? WORKOUTS[workoutKey] : null;

    if (!data) {
      setText("[data-workout-title]", "Workout");
      setText("[data-workout-duration]", "—");
      setText("[data-workout-difficulty]", "—");
      setText("[data-workout-benefits]", "—");
      setText("[data-workout-description]", "Please select a valid workout plan.");
      return;
    }

    // Title + summary fields
    setText("[data-workout-title]", workoutKey);
    setText("[data-workout-duration]", data.duration);
    setText("[data-workout-difficulty]", data.difficulty);
    setText("[data-workout-benefits]", data.benefits);

    // Put description + sample routine together in the existing description banner area
    const descriptionText = `${data.description}\n\nSample Routine:\n${data.sampleRoutine}`;
    setText("[data-workout-description]", descriptionText);

    // Keep existing mock total price synced with the chosen selection price
    const priceEl = document.querySelector("[data-workout-price]");
    if (priceEl && typeof data.price === "number") {
      priceEl.textContent = `$${data.price % 1 === 0 ? data.price.toFixed(0) : data.price.toFixed(2)}`;
    }

    // BACK button should return to Plan booking (not classes)
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.href = "Planbooking.html";
      });
    }

    // PURCHASE PLAN button -> add workout/class plan to cart and go to Checkout1.html
    const purchaseBtn = document.getElementById("purchaseBtn");
    if (purchaseBtn) {
      purchaseBtn.addEventListener("click", () => {
        const CART_STORAGE_KEY = "cart";

        // Add selected workout/class to the cart (checkoutFlow.js reads localStorage["cart"])
        const cart = (() => {
          try {
            const raw = window.localStorage.getItem(CART_STORAGE_KEY);
            const parsed = JSON.parse(raw ?? "[]");
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })();

        const cartItem = {
          id: workoutKey, // cart.js uses item.id to match/remove
          name: workoutKey,
          price: `$${data.price.toFixed(2)}`,
          quantity: "1",
          img: "",
        };

        cart.push(cartItem);
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

        window.location.href = "Checkout1.html";
      });
    }

    // ENROLL NOW: show green toast (no redirect)
    const enrollBtn = document.getElementById("enrollBtn");
    const toastEl = document.getElementById("enrollToast");
    if (enrollBtn && toastEl) {
      let hideTimer = null;

      const showToast = () => {
        if (hideTimer) window.clearTimeout(hideTimer);
        toastEl.classList.add("show");
        hideTimer = window.setTimeout(() => {
          toastEl.classList.remove("show");
        }, 2800);
      };

      enrollBtn.addEventListener("click", () => {
        showToast();
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
