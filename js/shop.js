/**
 * PRIMAL ATHLETIC - SHOP LOGIC (MERGED)
 * Handles filtering, view-all, and gated product access.
 */

// --- 1. ADD TO CART WITH LOGIN CHECK (Restored your feature) ---
// Function kapag pinindot ang Add to Cart
function addToCart(productId, quantity) {
    const isLoggedIn = localStorage.getItem('currentUserEmail');

    if (!isLoggedIn) {
        // Redirect to account page with the auth flag if not logged in
        window.location.href = "useraccount.html?auth=required";
        return; 
    }

    // I-save ang quantity sa Local Storage kung logged in
    localStorage.setItem('cartQuantity', quantity);
    
    // Lipat sa Checkout page
    window.location.href = "checkout.html"; 
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 2. UNIVERSAL FILTER FUNCTION (From your teammate) ---
    // Gagamitin ito para sa Supplements, Apparel, at Equipment
    function setupFilter(buttonContainerSelector, productsContainerSelector) {
        const buttons = document.querySelectorAll(`${buttonContainerSelector} .box`);
        const cards = document.querySelectorAll(`${productsContainerSelector} .product-card`);

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.textContent.trim().toUpperCase();

                cards.forEach(card => {
                    const cardCategory = card.querySelector('.product-category').textContent.trim().toUpperCase();
                    
                    // Matching Logic
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

    // --- 3. INITIALIZE ALL SECTIONS ---
    setupFilter('.supplements-boxes', '.supplements-products'); // Para sa Supplements
    setupFilter('.apparel-boxes', '.apparel-products');         // Para sa Apparel
    setupFilter('.equipment-boxes', '.equipment-products');     // Para sa Equipment

    // --- 4. RESET / VIEW ALL LOGIC (From your teammate) ---
    // Ginawa nating automatic para sa lahat ng "View All" links
    const viewAllLinks = document.querySelectorAll('.view-all-link');
    
    viewAllLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Hanapin ang pinakamalapit na section at ipakita lahat ng cards sa loob nito
            const section = link.closest('section') || link.parentElement.parentElement.parentElement;
            const allCards = section.querySelectorAll('.product-card');
            
            allCards.forEach(card => {
                card.style.display = 'flex';
                card.style.opacity = '1';
            });
        });
    });

    // --- 5. GATED PRODUCT ACCESS (Restored your feature) ---
    // If a user clicks a product card, check if they are logged in.
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const isLoggedIn = localStorage.getItem('currentUserEmail');
            
            if (!isLoggedIn) {
                e.preventDefault();
                e.stopPropagation(); // Stops the click from routing to the product page
                window.location.href = 'useraccount.html?auth=required';
            }
        });
    });
});