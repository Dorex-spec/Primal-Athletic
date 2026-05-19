// ==========================================
// 1. DYNAMIC NEWSLETTER DATE HOMEPAGE
// ==========================================
const today = new Date();
const formatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = today.toLocaleDateString('en-US', formatOptions);

const dateElement = document.getElementById('dynamic-date');
if (dateElement) {
    dateElement.textContent = formattedDate;
}

// ==========================================
// 2. NEWSLETTER SUBSCRIPTION FUNCTIONALITY
// ==========================================
const subscribeBtn = document.getElementById('subscribe-btn');
const emailInput = document.getElementById('email-input');

if (subscribeBtn && emailInput) {
    subscribeBtn.addEventListener('click', function(event) {
        event.preventDefault(); 
        
        if (emailInput.value !== '') {
            subscribeBtn.textContent = 'SUBSCRIBED! ✔';
            subscribeBtn.style.backgroundColor = '#4CAF50'; 
            subscribeBtn.style.color = '#FFFFFF';
            subscribeBtn.style.borderColor = '#4CAF50';
            emailInput.value = '';
            emailInput.placeholder = 'Welcome to the club!';
        } else {
            emailInput.placeholder = 'Please enter an email!';
        }
    });
}

// ==========================================
// 3. BROWSE PLANS: ALL FILTERS & REDIRECTIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Select all the cards once
    const planCards = document.querySelectorAll('.plan-card');

    // ==========================================
    // A. LEVEL FILTERING
    // ==========================================
    const byLevelBtn = document.getElementById('byLevelBtn');
    const levelFilterContainer = document.getElementById('levelFilterContainer');
    const levelFilterBtns = document.querySelectorAll('.filter-btn');

    if (byLevelBtn && levelFilterContainer) {
        byLevelBtn.addEventListener('click', () => {
            levelFilterContainer.classList.toggle('show');
        });
    }

    if (levelFilterBtns.length > 0) {
        levelFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                levelFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                planCards.forEach(card => {
                    // Level specifically looks at .plan-badge
                    const badgeElement = card.querySelector('.plan-badge');
                    const badgeText = badgeElement ? badgeElement.textContent.toLowerCase() : '';

                    if (filterValue === 'all' || badgeText.includes(filterValue)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ==========================================
    // B. GOAL FILTERING
    // ==========================================
    const byGoalBtn = document.getElementById('byGoalBtn');
    const goalFilterContainer = document.getElementById('goalFilterContainer');
    const goalFilterBtns = document.querySelectorAll('.goal-filter-btn');

    if (byGoalBtn && goalFilterContainer) {
        byGoalBtn.addEventListener('click', () => {
            goalFilterContainer.classList.toggle('show');
        });
    }

    if (goalFilterBtns.length > 0) {
        goalFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                goalFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                planCards.forEach(card => {
                    // Goal looks at the text inside the .plan-details-list
                    const detailsElement = card.querySelector('.plan-details-list');
                    const detailsText = detailsElement ? detailsElement.textContent.toLowerCase() : '';

                    if (filterValue === 'all' || detailsText.includes(filterValue)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ==========================================
    // C. EQUIPMENT FILTERING
    // ==========================================
    const byEquipmentBtn = document.getElementById('byEquipmentBtn');
    const equipmentFilterContainer = document.getElementById('equipmentFilterContainer');
    const equipmentFilterBtns = document.querySelectorAll('.equipment-filter-btn');

    if (byEquipmentBtn && equipmentFilterContainer) {
        byEquipmentBtn.addEventListener('click', () => {
            equipmentFilterContainer.classList.toggle('show');
        });
    }

    if (equipmentFilterBtns.length > 0) {
        equipmentFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                equipmentFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                planCards.forEach(card => {
                    // Equipment looks at the text inside the .plan-details-list
                    const detailsElement = card.querySelector('.plan-details-list');
                    const detailsText = detailsElement ? detailsElement.textContent.toLowerCase() : '';

                    if (filterValue === 'all' || detailsText.includes(filterValue)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ==========================================
    // D. VIEW DETAILS REDIRECTION (NEWLY ADDED)
    // ==========================================
    const DETAILS_URL = "Work out detaileds.html";
    const REQUIRED_TITLES = new Set([
        "7 Days Quick Start",
        "10 Days Challenge",
        "For Busy Professionals",
        "30 Days Challenge",
        "Fat Burn Program"
    ]);

    planCards.forEach(cardEl => {
        const titleEl = cardEl.querySelector(".plan-title");
        const rawTitle = titleEl ? titleEl.textContent.trim() : "";
        
        // Find matching name for URL formatting
        let matchedTitle = null;
        if (REQUIRED_TITLES.has(rawTitle)) {
            matchedTitle = rawTitle;
        } else {
            const lower = rawTitle.toLowerCase();
            for (const t of REQUIRED_TITLES) {
                if (t.toLowerCase() === lower) {
                    matchedTitle = t;
                    break;
                }
            }
        }

        const btn = cardEl.querySelector(".view-btn");
        if (btn && matchedTitle) {
            btn.addEventListener("click", () => {
                const params = new URLSearchParams({ workout: matchedTitle });
                window.location.href = `${DETAILS_URL}?${params.toString()}`;
            });
        }
    });
});

// ==========================================
// 4. SITE SEARCH FUNCTIONALITY
// ==========================================
const searchInput = document.getElementById('site-search');
const resultsBox = document.getElementById('search-results');

const siteContent = [
    { title: "Home", link: "homepage.html", tags: "gym primal main" },
    { title: "Shop", link: "shop.html", tags: "weights gear clothes" },
    { title: "Services", link: "Planbooking.html", tags: "training personal coach" },
    { title: "About Us", link: "aboutus.html", tags: "story team history" },
    { title: "Account Settings", link: "useraccount.html", tags: "personal details" },
    { title: "Classes", link: "classes.html", tags: "browse plans" },
    { title: "Workout Plans", link: "Planbooking.html", tags: "workout plans" }
];

if (searchInput && resultsBox) {
    searchInput.addEventListener('input', () => {
        let query = searchInput.value.toLowerCase();
        resultsBox.innerHTML = ""; // Clear previous results

        if (query.length > 1) {
            let matches = siteContent.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.tags.toLowerCase().includes(query)
            );

            matches.forEach(match => {
                let resultLink = document.createElement('a');
                resultLink.href = match.link;
                resultLink.textContent = match.title;
                resultLink.style.display = "block";
                resultLink.style.padding = "5px";
                resultLink.style.color = "#ff9900";
                resultsBox.appendChild(resultLink);
            });
        }
    });
}