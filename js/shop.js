/**
 * PRIMAL ATHLETIC - SHOP LOGIC
 * Handles filtering, view-all, and gated product access.
 */

// 1. ADD TO CART WITH LOGIN CHECK
function addToCart(productId, quantity) {
    const isLoggedIn = localStorage.getItem('currentUserEmail');

    if (!isLoggedIn) {
        // Redirect to account page with the auth flag if not logged in
        window.location.href = "useraccount.html?auth=required";
        return; 
    }

    // Proceed if logged in
    localStorage.setItem('cartQuantity', quantity);
    window.location.href = "checkout.html"; 
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 2. UNIVERSAL FILTER FUNCTION ---
    function setupFilter(buttonContainerSelector, productsContainerSelector) {
        const buttons = document.querySelectorAll(`${buttonContainerSelector} .box`);
        const cards = document.querySelectorAll(`${productsContainerSelector} .product-card`);

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.textContent.trim().toUpperCase();
                cards.forEach(card => {
                    const cardCategory = card.querySelector('.product-category').textContent.trim().toUpperCase();
                    if (cardCategory === filterValue) {
                        card.style.display = 'flex';
                        card.style.opacity = '1';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- 3. INITIALIZE FILTERS ---
    setupFilter('.supplements-boxes', '.supplements-products'); 
    setupFilter('.apparel-boxes', '.apparel-products');         
    setupFilter('.equipment-boxes', '.equipment-products');     

    // --- 4. VIEW ALL LOGIC ---
    const viewAllLinks = document.querySelectorAll('.view-all-link');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.closest('section') || link.parentElement.parentElement.parentElement;
            const allCards = section.querySelectorAll('.product-card');
            allCards.forEach(card => {
                card.style.display = 'flex';
                card.style.opacity = '1';
            });
        });
    });

    // --- 5. GATED PRODUCT ACCESS ---
    // If a user clicks a product card, check if they are logged in.
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const isLoggedIn = localStorage.getItem('currentUserEmail');
            
            if (!isLoggedIn) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = 'useraccount.html?auth=required';
            }
        });
    });
});