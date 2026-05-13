// Function kapag pinindot ang Add to Cart
function addToCart(productId, quantity) {
    // I-save ang quantity sa Local Storage
    localStorage.setItem('cartQuantity', quantity);
    
    // Lipat sa Checkout page (optional)
    window.location.href = "checkout.html"; 
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. UNIVERSAL FILTER FUNCTION ---
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

    // --- 2. INITIALIZE ALL SECTIONS ---
    setupFilter('.supplements-boxes', '.supplements-products'); // Para sa Supplements
    setupFilter('.apparel-boxes', '.apparel-products');         // Para sa Apparel
    setupFilter('.equipment-boxes', '.equipment-products');     // Para sa Equipment (NEW)

    // --- 3. RESET / VIEW ALL LOGIC ---
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
});