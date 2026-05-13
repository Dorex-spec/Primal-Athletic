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
// 3. BROWSE PLANS: ALL FILTERS
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
});

const searchInput = document.getElementById('site-search');
const resultsBox = document.getElementById('search-results');

// Add your site data here
const siteContent = [
    { title: "Home", link: "homepage.html", tags: "gym primal main" },
    { title: "Shop", title: "shop", link: "shop.html", tags: "weights gear clothes" },
    { title: "Services", title: "services", link: "Planbooking.html", tags: "training personal coach" },
    { title: "About Us", title: "about us", link: "aboutus.html", tags: "story team history" },
    { title: "Account Settings", title: "account settings", link: "useraccount.html", tags: "personal details" },
    { title: "Classes", title: "classes", link: "classes.html", tags: "browse plans" },
    { title: "Workout Plans", title: "workout plans", link: "Planbooking.html", tags: "workout plans" }
];

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

