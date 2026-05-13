document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Handle Simple Text Edits (Name, Email, Phone) ---
    const editButtons = document.querySelectorAll('[data-action="edit-display-name"], [data-action="edit-personal"]');

    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Find the closest value element related to this button
            const container = btn.closest('.header-info-row, .detail-row');
            const displayElement = container.querySelector('#profile-name, [data-field-value]');
            
            if (!displayElement) return;

            const currentValue = displayElement.innerText;
            const newValue = prompt(`Edit ${displayElement.id || 'Information'}:`, currentValue);

            if (newValue && newValue.trim() !== "") {
                displayElement.innerText = newValue.toUpperCase();
                
                // If the email was changed, update the session email at the bottom too
                if (displayElement.getAttribute('data-field-value') === 'email') {
                    const sessionEmail = document.querySelector('[data-session-email]');
                    if (sessionEmail) sessionEmail.innerText = newValue.toUpperCase();
                }
            }
        });
    });

    // --- 2. Handle Shipping Address Edit ---
    const editShippingBtn = document.querySelector('[data-action="edit-shipping"]');
    editShippingBtn.addEventListener('click', () => {
        const addressLines = document.querySelectorAll('#shipping-edit-host span');
        
        // In a real app, this would open a Modal. For now, we'll prompt for each line.
        const line1 = prompt("Full Name:", addressLines[0].innerText);
        const line2 = prompt("Street Address:", addressLines[1].innerText);
        const line4 = prompt("City, State, Zip:", addressLines[3].innerText);

        if (line1) addressLines[0].innerText = line1;
        if (line2) addressLines[1].innerText = line2;
        if (line4) addressLines[3].innerText = line4;
    });

    // --- 3. Handle Logout ---
    const logoutBtn = document.querySelector('.btn-black-full');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to log out?")) {
                // Redirect to homepage or login page
                window.location.href = "homepage.html";
            }
        });
    }

    // --- 4. Navigation Icons (Visual feedback) ---
    // Since your icons are <a> tags, they already work, but we can add an "active" state
    const currentPath = window.location.pathname;
    const profileIcon = document.querySelector('.icon-profile');
    if (currentPath.includes('useraccount.html') && profileIcon) {
        profileIcon.style.filter = "drop-shadow(0 0 5px #F6A820)";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT THE PAYMENT SECTION BODY
    const paymentBody = document.querySelector('.card-body'); 

    paymentBody.addEventListener('click', (e) => {
        // --- HANDLE "EDIT" BUTTONS ---
        if (e.target.classList.contains('btn-white') && e.target.innerText === 'EDIT') {
            const cardRow = e.target.closest('.payment-card');
            const cardNumberSpan = cardRow.querySelector('.card-number');
            const cardExpirySpan = cardRow.querySelector('.card-expiry');
            const badge = cardRow.querySelector('.badge-white');

            const newType = prompt("Card Type (VISA/MASTERCARD):", badge.innerText);
            const newDigits = prompt("Enter last 4 digits:", cardNumberSpan.innerText.slice(-4));
            const newExpiry = prompt("Enter expiry (MM/YYYY):", cardExpirySpan.innerText.replace('Expires ', ''));

            if (newType) badge.innerText = newType.toUpperCase();
            if (newDigits && newDigits.length === 4) cardNumberSpan.innerText = `**** **** **** ${newDigits}`;
            if (newExpiry) cardExpirySpan.innerText = `Expires ${newExpiry}`;
        }

        // --- HANDLE "ADD PAYMENT METHOD" BUTTON ---
        if (e.target.hasAttribute('data-action') && e.target.getAttribute('data-action') === 'add-payment') {
            const type = prompt("Card Type:", "VISA");
            const digits = prompt("Last 4 digits:", "0000");

            if (type && digits) {
                // Create a new card using your exact HTML structure
                const newMethod = document.createElement('div');
                newMethod.className = "inner-card bg-primary payment-card";
                newMethod.innerHTML = `
                    <div class="payment-left">
                        <div class="badge-white">${type.toUpperCase()}</div>
                        <div class="payment-info">
                            <span class="card-number">**** **** **** ${digits}</span>
                            <span class="card-expiry">Expires 01/2030</span>
                        </div>
                    </div>
                    <div class="payment-right">
                        <button class="btn-white">EDIT</button>
                    </div>
                `;
                // Inserts it right above the "Add" button
                e.target.before(newMethod);
            }
        }
    });

    // --- HANDLE LOGOUT ---
    const logoutBtn = document.querySelector('.btn-black-full');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm("Log out of Primal Athletic?")) {
                window.location.href = "homepage.html";
            }
        });
    }
});