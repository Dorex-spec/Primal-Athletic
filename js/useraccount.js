document.addEventListener('DOMContentLoaded', () => {

    // --- STARTUP LOGIC ---
    (function initPersistentAccount() {
        let users = JSON.parse(localStorage.getItem('primalUsers') || '[]');
        const defaultEmail = "spmatienzo0210qc@student.fatima.edu.ph";

        // Check if the persistent account already exists
        if (!users.find(u => u.email === defaultEmail)) {
            users.push({
                email: defaultEmail,
                password: "Primal-athletics",
                displayName: "" // Added field for custom names
            });
            localStorage.setItem('primalUsers', JSON.stringify(users));
        }

        // Restore active session if it exists
        const savedUser = localStorage.getItem('currentUserEmail');
        if (savedUser) {
            // Slight delay to ensure DOM is fully ready
            setTimeout(() => updateUIForLogin(savedUser), 100);
        }
    })();

    // Helper to update the profile name (stops at the first "." or uses Custom Name)
    function updateProfileName(email) {
        let users = JSON.parse(localStorage.getItem('primalUsers') || '[]');
        const user = users.find(u => u.email === email);

        // If the user has a saved custom display name, use it. Otherwise, extract from email.
        const formattedName = (user && user.displayName) 
            ? user.displayName 
            : email.split('.')[0].toUpperCase();

        // Update the profile box
        const nameLabel = document.querySelector('.profile-name-label') || document.getElementById('profile-name'); 
        if (nameLabel) {
            nameLabel.innerText = formattedName;
        }
    }

    // ==========================================
    // 1. CORE FUNCTION TO GENERATE EDIT MODALS
    // ==========================================
    function showEditModal(title, inputsConfig, onSaveCallback, onRemoveCallback) {
        const existing = document.getElementById('customEditModal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'customEditModal';
        overlay.className = 'custom-modal-overlay';

        const box = document.createElement('div');
        box.className = 'custom-modal-box';

        const heading = document.createElement('h3');
        heading.innerText = title;
        box.appendChild(heading);

        const inputElements = [];

        // Build inputs (Supports Dropdowns and Text boxes)
        inputsConfig.forEach(config => {
            let input;

            if (config.type === 'select') {
                input = document.createElement('select');
                input.className = 'custom-modal-input';
                config.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.innerText = opt;
                    if (opt === config.value) option.selected = true;
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = config.type || 'text';
                input.placeholder = config.placeholder;
                input.value = config.value || '';
                if (config.maxLength) input.maxLength = config.maxLength;
                input.className = 'custom-modal-input';
            }

            box.appendChild(input);
            inputElements.push(input);
        });

        const btnContainer = document.createElement('div');
        btnContainer.className = 'custom-modal-actions';

        // --- REMOVE BUTTON ---
        if (onRemoveCallback) {
            const removeBtn = document.createElement('button');
            removeBtn.innerText = 'REMOVE';
            removeBtn.className = 'custom-modal-btn';

            removeBtn.style.marginRight = "auto";
            removeBtn.style.color = "#F5A623";
            removeBtn.style.borderColor = "#F5A623";
            removeBtn.style.backgroundColor = "#ffffff";
            removeBtn.style.cursor = "pointer";

            removeBtn.onmouseenter = () => {
                removeBtn.style.backgroundColor = "#F5A623";
                removeBtn.style.color = "#ffffff";
            };
            removeBtn.onmouseleave = () => {
                removeBtn.style.backgroundColor = "#ffffff";
                removeBtn.style.color = "#F5A623";
            };

            removeBtn.onclick = () => {
                if (confirm("Are you sure you want to remove this payment method?")) {
                    onRemoveCallback();
                    overlay.remove();
                }
            };
            btnContainer.appendChild(removeBtn);
        }

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'CANCEL';
        cancelBtn.className = 'custom-modal-btn btn-cancel';
        cancelBtn.onclick = () => overlay.remove();

        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'SAVE';
        saveBtn.className = 'custom-modal-btn btn-save';
        saveBtn.onclick = () => {
            const values = inputElements.map(el => el.value.trim());
            const shouldClose = onSaveCallback(values);
            if (shouldClose !== false) {
                overlay.remove();
            }
        };

        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(saveBtn);
        box.appendChild(btnContainer);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }


    // ==========================================
    // 2. PROFILE & DETAILS EDIT FUNCTIONS
    // ==========================================

    // --- 2a. User Profile Display Name & Avatar Edit ---
    function setupDisplayNameEdit() {
        const editNameBtns = document.querySelectorAll('[data-action="edit-display-name"]');

        editNameBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const displayElement = document.getElementById('profile-name');
                const avatarBox = document.querySelector('.avatar-box');
                if (!displayElement || !avatarBox) return;

                const overlay = document.createElement('div');
                overlay.className = 'custom-modal-overlay';

                const box = document.createElement('div');
                box.className = 'custom-modal-box';
                box.style.maxWidth = '500px';

                const heading = document.createElement('h3');
                heading.innerText = 'Edit Profile';
                box.appendChild(heading);

                const splitContainer = document.createElement('div');
                splitContainer.style.display = 'flex';
                splitContainer.style.gap = '20px';
                splitContainer.style.alignItems = 'center';
                splitContainer.style.marginTop = '15px';
                splitContainer.style.marginBottom = '20px';

                // --- LEFT SIDE: Image Upload ---
                const leftSide = document.createElement('div');
                leftSide.style.display = 'flex';
                leftSide.style.flexDirection = 'column';
                leftSide.style.alignItems = 'center';
                leftSide.style.gap = '10px';

                const imagePreview = document.createElement('div');
                imagePreview.style.width = '80px';
                imagePreview.style.height = '80px';
                imagePreview.style.backgroundColor = '#000';
                imagePreview.style.display = 'flex';
                imagePreview.style.justifyContent = 'center';
                imagePreview.style.alignItems = 'flex-end';
                imagePreview.style.overflow = 'hidden';

                let currentImgData = null;
                const existingImg = avatarBox.querySelector('img');
                if (existingImg) {
                    imagePreview.innerHTML = `<img src="${existingImg.src}" style="width:100%; height:100%; object-fit:cover;">`;
                    currentImgData = existingImg.src;
                } else {
                    imagePreview.innerHTML = `<svg viewBox="0 0 24 24" fill="#999" style="width: 70px; height: 70px; margin-bottom: -5px;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
                }

                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.display = 'none';

                const uploadBtn = document.createElement('button');
                uploadBtn.innerText = 'UPLOAD';
                uploadBtn.className = 'custom-modal-btn';
                uploadBtn.style.backgroundColor = '#fff';
                uploadBtn.style.color = '#000';
                uploadBtn.style.padding = '8px 15px';
                uploadBtn.style.fontSize = '12px';

                uploadBtn.onclick = () => fileInput.click();

                fileInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            currentImgData = event.target.result;
                            imagePreview.innerHTML = `<img src="${currentImgData}" style="width:100%; height:100%; object-fit:cover;">`;
                        };
                        reader.readAsDataURL(file);
                    }
                };

                leftSide.appendChild(imagePreview);
                leftSide.appendChild(uploadBtn);
                leftSide.appendChild(fileInput);

                // --- RIGHT SIDE: Name Input ---
                const rightSide = document.createElement('div');
                rightSide.style.flex = '1';
                rightSide.style.display = 'flex';
                rightSide.style.flexDirection = 'column';
                rightSide.style.justifyContent = 'center';

                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.placeholder = 'Full Name';
                const currentText = displayElement.innerText;
                nameInput.value = (currentText.toUpperCase() === 'INSERT NAME') ? '' : currentText;
                nameInput.className = 'custom-modal-input';
                nameInput.style.marginBottom = '0';

                rightSide.appendChild(nameInput);
                splitContainer.appendChild(leftSide);
                splitContainer.appendChild(rightSide);
                box.appendChild(splitContainer);

                const btnContainer = document.createElement('div');
                btnContainer.className = 'custom-modal-actions';

                const cancelBtn = document.createElement('button');
                cancelBtn.innerText = 'CANCEL';
                cancelBtn.className = 'custom-modal-btn btn-cancel';
                cancelBtn.onclick = () => overlay.remove();

                const saveBtn = document.createElement('button');
                saveBtn.innerText = 'SAVE';
                saveBtn.className = 'custom-modal-btn btn-save';
                saveBtn.onclick = () => {
                    const newName = nameInput.value.trim().toUpperCase();
                    if (newName !== "") {
                        displayElement.innerText = newName;
                        
                        // Save the new custom name to LocalStorage for the current user
                        const currentUserEmail = localStorage.getItem('currentUserEmail');
                        if (currentUserEmail) {
                            let users = JSON.parse(localStorage.getItem('primalUsers') || '[]');
                            const userIndex = users.findIndex(u => u.email === currentUserEmail);
                            if (userIndex !== -1) {
                                users[userIndex].displayName = newName; // Save custom name
                                localStorage.setItem('primalUsers', JSON.stringify(users));
                            }
                        }
                    }

                    if (currentImgData) avatarBox.innerHTML = `<img src="${currentImgData}" style="width:100%; height:100%; object-fit:cover;">`;
                    overlay.remove();
                };

                btnContainer.appendChild(cancelBtn);
                btnContainer.appendChild(saveBtn);
                box.appendChild(btnContainer);
                overlay.appendChild(box);
                document.body.appendChild(overlay);
            });
        });
    }

    // --- 2b. Profile Picture Zoom Function ---
    function setupAvatarZoom() {
        const avatarBox = document.querySelector('.avatar-box');
        if (!avatarBox) return;

        avatarBox.addEventListener('click', (e) => {
            if (document.querySelector('.custom-modal-overlay')) return;
            const currentContent = avatarBox.innerHTML;

            const overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';

            const closeBtn = document.createElement('div');
            closeBtn.className = 'lightbox-close';
            closeBtn.innerHTML = '&times;';

            const contentContainer = document.createElement('div');
            contentContainer.className = 'lightbox-content';
            contentContainer.style.width = '400px';
            contentContainer.style.height = '400px';
            contentContainer.style.backgroundColor = '#000';
            contentContainer.style.display = 'flex';
            contentContainer.style.justifyContent = 'center';
            contentContainer.style.alignItems = 'center';
            contentContainer.style.overflow = 'hidden';
            contentContainer.innerHTML = currentContent;

            const img = contentContainer.querySelector('img');
            if (img) {
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
            }

            const closeZoom = () => overlay.remove();
            closeBtn.onclick = closeZoom;
            overlay.onclick = (e) => { if (e.target === overlay) closeZoom(); };

            overlay.appendChild(closeBtn);
            overlay.appendChild(contentContainer);
            document.body.appendChild(overlay);
        });
    }

    // --- 2c. Personal Details Edit ---
    function setupPersonalDetailsEdits() {
        const editPersonalBtns = document.querySelectorAll('[data-action="edit-personal"]');

        editPersonalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                let emailEl = document.querySelector('[data-field-value="email"]');
                let phoneEl = document.querySelector('[data-field-value="phone"]');

                if (!emailEl || !phoneEl) {
                    const values = document.querySelectorAll('.detail-row .value');
                    if (!emailEl && values.length > 0) emailEl = values[0];
                    if (!phoneEl && values.length > 1) phoneEl = values[1];
                }

                showEditModal("Edit Personal Details", [
                    { type: 'text', placeholder: "Email Address", value: emailEl ? emailEl.innerText : '' },
                    { type: 'text', placeholder: "Phone Number", value: phoneEl ? phoneEl.innerText : '' }
                ], (newValues) => {
                    const newEmail = newValues[0];
                    const newPhone = newValues[1];

                    if (newEmail !== "") {
                        if (!newEmail.includes('@')) {
                            alert("Please enter a valid email address with an '@' symbol.");
                            return false;
                        }
                        if (emailEl) emailEl.innerText = newEmail.toUpperCase();
                        const sessionEmail = document.querySelector('.personal-email-display');
                        if (sessionEmail) sessionEmail.innerText = newEmail.toUpperCase();
                    }
                    if (newPhone !== "" && phoneEl) {
                        phoneEl.innerText = newPhone.toUpperCase();
                    }
                });
            });
        });
    }

    // --- 2d. Shipping Address Edits ---
    function setupShippingEdits() {
        const editShippingBtn = document.querySelector('[data-action="edit-shipping"]');
        const shippingHost = document.getElementById('shipping-edit-host');

        if (!editShippingBtn || !shippingHost) return;

        editShippingBtn.addEventListener('click', () => {
            const currentLines = shippingHost.innerText.split('\n').filter(line => line.trim() !== '');

            let defaultName = currentLines[0] || '';
            let defaultStreet = currentLines[1] || '';
            let defaultDate = '';
            let defaultCity = '';
            let defaultCountry = '';

            if (currentLines.length === 3) {
                defaultCity = currentLines[2] || '';
            } else if (currentLines.length >= 5) {
                defaultDate = currentLines[2] || '';
                defaultCity = currentLines[3] || '';
                defaultCountry = currentLines[4] || '';
            }

            showEditModal("Edit Shipping Details", [
                { type: 'text', placeholder: "Full Name", value: defaultName },
                { type: 'text', placeholder: "Street address", value: defaultStreet },
                { type: 'text', placeholder: "Date", value: defaultDate },
                { type: 'text', placeholder: "City, State, Zip", value: defaultCity },
                { type: 'text', placeholder: "Country", value: defaultCountry }
            ], (newValues) => {
                shippingHost.innerHTML = `
                    <span style="display:block; font-weight:600; margin-bottom:4px;">${newValues[0].toUpperCase()}</span>
                    <span style="display:block;">${newValues[1].toUpperCase()}</span>
                    <span style="display:block;">${newValues[2].toUpperCase()}</span>
                    <span style="display:block;">${newValues[3].toUpperCase()}</span>
                    <span style="display:block;">${newValues[4].toUpperCase()}</span>
                `;
            });
        });
    }

    // --- 2e. Payment Methods ---
    function setupPayments() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-white') && e.target.innerText === 'EDIT' && e.target.closest('.payment-card')) {
                const cardRow = e.target.closest('.payment-card');
                const cardNumberSpan = cardRow.querySelector('.card-number');
                const badge = cardRow.querySelector('.badge-white');
                const expirySpan = cardRow.querySelector('.card-expiry');

                const currentExpiry = expirySpan ? expirySpan.innerText.replace('Expires ', '') : '';

                showEditModal("Edit Payment Card", [
                    { type: 'select', options: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'], value: badge.innerText },
                    { type: 'text', placeholder: "Enter FULL Card Number (15-16 Digits)", value: "", maxLength: 16 },
                    { type: 'text', placeholder: "Expiry (MM/YYYY)", value: currentExpiry, maxLength: 7 }
                ],
                    (newValues) => {
                        const type = newValues[0];
                        const fullNumber = newValues[1].replace(/\D/g, '');
                        const expiry = newValues[2];

                        if (fullNumber !== "") {
                            if (type === 'AMEX' && fullNumber.length !== 15) {
                                alert("AMEX cards require exactly 15 digits.");
                                return false;
                            } else if (type !== 'AMEX' && fullNumber.length !== 16) {
                                alert(`${type} cards require exactly 16 digits.`);
                                return false;
                            }
                            cardNumberSpan.innerText = `**** **** **** ${fullNumber.slice(-4)}`;
                        }

                        if (expiry && !/^\d{2}\/\d{4}$/.test(expiry)) {
                            alert("Please enter expiry exactly as MM/YYYY.");
                            return false;
                        }

                        badge.innerText = type.toUpperCase();
                        if (expiry) expirySpan.innerText = `Expires ${expiry}`;
                    },
                    () => {
                        cardRow.remove();
                    }
                );
            }

            if (e.target.hasAttribute('data-action') && e.target.getAttribute('data-action') === 'add-payment') {
                showEditModal("Add Payment Method", [
                    { type: 'select', options: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'], value: 'VISA' },
                    { type: 'text', placeholder: "Enter FULL Card Number", value: "", maxLength: 16 },
                    { type: 'text', placeholder: "Expiry Date (MM/YYYY)", value: "", maxLength: 7 }
                ], (newValues) => {
                    const type = newValues[0];
                    const fullNumber = newValues[1].replace(/\D/g, '');
                    const expiry = newValues[2];

                    if (type === 'AMEX' && fullNumber.length !== 15) {
                        alert("AMEX cards require exactly 15 digits.");
                        return false;
                    } else if (type !== 'AMEX' && fullNumber.length !== 16) {
                        alert(`${type} cards require exactly 16 digits.`);
                        return false;
                    }

                    if (!/^\d{2}\/\d{4}$/.test(expiry)) {
                        alert("Please enter expiry exactly as MM/YYYY.");
                        return false;
                    }

                    const last4Digits = fullNumber.slice(-4);

                    const newMethod = document.createElement('div');
                    newMethod.className = "inner-card bg-primary payment-card";
                    newMethod.innerHTML = `
                        <div class="payment-left">
                            <div class="badge-white">${type.toUpperCase()}</div>
                            <div class="payment-info">
                                <span class="card-number">**** **** **** ${last4Digits}</span>
                                <span class="card-expiry">Expires ${expiry}</span>
                            </div>
                        </div>
                        <div class="payment-right">
                            <button class="btn-white">EDIT</button>
                        </div>
                    `;
                    e.target.before(newMethod);
                });
            }
        });
    }

    // --- 2f. Change Password Flow ---
    function setupPasswordChange() {
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-action') && e.target.getAttribute('data-action') === 'change-password') {
                
                const currentUserEmail = localStorage.getItem('currentUserEmail');
                
                if (!currentUserEmail) {
                    alert("Please log in first to change your password.");
                    return;
                }

                showEditModal("Verify Identity", [
                    { type: 'password', placeholder: "Enter current password", value: "" }
                ], (verifyValues) => {
                    const inputPassword = verifyValues[0];
                    
                    let users = JSON.parse(localStorage.getItem('primalUsers') || '[]');
                    const userIndex = users.findIndex(u => u.email === currentUserEmail);

                    if (userIndex === -1) {
                        alert("User session error. Please log out and log in again.");
                        return true; 
                    }

                    if (users[userIndex].password !== inputPassword) {
                        alert("Incorrect current password. Please try again.");
                        return false; 
                    }

                    setTimeout(() => {
                        showEditModal("Change Password", [
                            { type: 'password', placeholder: "New Password", value: "" },
                            { type: 'password', placeholder: "Confirm New Password", value: "" }
                        ], (newValues) => {
                            const newPass = newValues[0];
                            const confirmPass = newValues[1];

                            if (newPass === "" || confirmPass === "") {
                                alert("Passwords cannot be empty.");
                                return false;
                            }

                            if (newPass !== confirmPass) {
                                alert("New passwords do not match!");
                                return false;
                            }

                            users[userIndex].password = newPass;
                            localStorage.setItem('primalUsers', JSON.stringify(users));
                            
                            showSuccessNotification("PASSWORD UPDATED SUCCESSFULLY");
                            return true; 
                        });
                    }, 100);

                    return true; 
                });
            }
        });
    }

    // --- 2g. Email Notification Settings ---
    function setupNotifications() {
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-action') && e.target.getAttribute('data-action') === 'manage-notifications') {
                
                const overlay = document.createElement('div');
                overlay.className = 'custom-modal-overlay';
                
                const box = document.createElement('div');
                box.className = 'custom-modal-box';
                box.style.width = '400px';

                box.innerHTML = `
                    <h3 style="font-family: 'Epilogue'; font-weight: 600; margin-bottom: 25px;">Manage Notifications</h3>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-family: 'Epilogue';">
                        <span style="font-size: 16px;">Order Updates</span>
                        <select class="custom-modal-input" style="width: 100px; margin: 0; padding: 8px;">
                            <option value="ON">ON</option>
                            <option value="OFF">OFF</option>
                        </select>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; font-family: 'Epilogue';">
                        <span style="font-size: 16px;">Promotions & Offers</span>
                        <select class="custom-modal-input" style="width: 100px; margin: 0; padding: 8px;">
                            <option value="ON">ON</option>
                            <option value="OFF">OFF</option>
                        </select>
                    </div>

                    <div class="custom-modal-actions" style="justify-content: flex-end;">
                        <button class="custom-modal-btn btn-cancel" id="cancelNotifBtn">CANCEL</button>
                        <button class="custom-modal-btn btn-save" id="saveNotifBtn">SAVE</button>
                    </div>
                `;

                document.body.appendChild(overlay);
                overlay.appendChild(box);

                document.getElementById('cancelNotifBtn').onclick = () => overlay.remove();
                document.getElementById('saveNotifBtn').onclick = () => {
                    showSuccessNotification("NOTIFICATIONS UPDATED");
                    overlay.remove();
                };
            }
        });
    }


    // ==========================================
    // 3. LOGIN & LOGOUT SYSTEM
    // ==========================================

    function updateUIForLogin(email) {
        localStorage.setItem('currentUserEmail', email);

        const sessionStatusLabel = document.querySelector('.logged-in-as-text');
        const sessionEmailText = document.querySelector('.session-email'); 
        const sessionBtn = document.querySelector('.session-login-btn, .btn-black-full');

        if (sessionStatusLabel) sessionStatusLabel.innerText = "LOGGED IN AS"; 
        if (sessionEmailText) sessionEmailText.innerText = email.toUpperCase(); 
        if (sessionBtn) sessionBtn.innerText = "LOG OUT";

        const personalEmail = document.querySelector('.personal-email-display');
        const detailEmail = document.querySelector('[data-field-value="email"]'); 

        if (personalEmail) personalEmail.innerText = email.toUpperCase();
        if (detailEmail) detailEmail.innerText = email.toUpperCase();

        updateProfileName(email);
    }

    function handleLogout() {
        // 1. Grab the current user's email BEFORE clearing the session
        const lastEmail = localStorage.getItem('currentUserEmail') || "JOHN.DOE@EMAIL.COM";
        
        // 2. Clear the active session
        localStorage.removeItem('currentUserEmail');

        // Grab all the UI elements
        const sessionStatusLabel = document.querySelector('.logged-in-as-text');
        const sessionEmailText = document.querySelector('.session-email');
        const sessionBtn = document.querySelector('.session-login-btn, .btn-black-full');
        const personalEmail = document.querySelector('.personal-email-display');
        const detailEmail = document.querySelector('[data-field-value="email"]');
        const nameLabel = document.querySelector('.profile-name-label') || document.getElementById('profile-name');

        // 3. Update the UI to show "LOG IN AS" but keep the user's actual email visible!
        if (sessionStatusLabel) sessionStatusLabel.innerText = "LOG IN AS"; 
        if (sessionEmailText) sessionEmailText.innerText = lastEmail.toUpperCase(); 
        if (sessionBtn) sessionBtn.innerText = "LOG IN";
        if (personalEmail) personalEmail.innerText = lastEmail.toUpperCase();
        if (detailEmail) detailEmail.innerText = lastEmail.toUpperCase();
        
        // 4. Try to keep their name visible too, instead of defaulting back to "INSERT NAME"
        let users = JSON.parse(localStorage.getItem('primalUsers') || '[]');
        const user = users.find(u => u.email === lastEmail);
        
        // Check if they have a custom name, otherwise use the first part of their email
        const formattedName = (user && user.displayName) 
            ? user.displayName 
            : (lastEmail !== "JOHN.DOE@EMAIL.COM" ? lastEmail.split('.')[0].toUpperCase() : "INSERT NAME");

        if (nameLabel) nameLabel.innerText = formattedName;

        showSuccessNotification("LOGGED OUT SUCCESSFULLY");
    }

    function showLogoutConfirmModal() {
        const overlay = document.createElement('div');
        overlay.className = 'custom-modal-overlay';

        const box = document.createElement('div');
        box.className = 'custom-modal-box';
        box.style.textAlign = 'center';
        box.style.padding = "40px";

        box.innerHTML = `
            <h3 style="font-family: 'Epilogue'; font-weight: 600;">Wait! You're leaving?</h3>
            <p style="font-family: 'Epilogue'; font-weight: 300; margin-bottom: 30px;">Are you sure you want to log out?</p>
            <div class="custom-modal-actions" style="justify-content: center; gap: 15px;">
                <button class="custom-modal-btn btn-cancel" id="confirmCancelBtn">CANCEL</button>
                <button class="custom-modal-btn btn-save" id="confirmLogoutBtn">CONTINUE</button>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.appendChild(box);

        document.getElementById('confirmCancelBtn').onclick = () => overlay.remove();
        document.getElementById('confirmLogoutBtn').onclick = () => {
            handleLogout(); 
            overlay.remove();
        };
    }

    function showChoicePopup() {
        const existing = document.querySelector('.login-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'login-overlay';

        const box = document.createElement('div');
        box.style.width = "400px";
        box.style.height = "250px";
        box.style.backgroundColor = "#FFFFFF";
        box.style.border = "2px solid #000000";
        box.style.borderRadius = "10px";
        box.style.position = "relative";
        box.style.display = "flex";
        box.style.flexDirection = "column";
        box.style.alignItems = "center";
        box.style.justifyContent = "center";
        box.style.padding = "20px";

        box.innerHTML = `
        <div class="login-close-x" id="closeChoice" style="position: absolute; top: 10px; right: 15px; font-size: 24px; color: #D6D6D6; cursor: pointer;">&times;</div>
        
        <h2 style="margin: 0; margin-bottom: 25px; font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #000000; letter-spacing: 0.05em;">WELCOME TO PRIMAL</h2>
        
        <button id="choiceLogin" style="width: 320px; height: 50px; margin-bottom: 15px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #000000; background-color: #F5A623; border: 2px solid #000000; border-radius: 10px; cursor: pointer; letter-spacing: 0.06em;">LOG IN</button>
        
        <button id="choiceSignUp" style="width: 320px; height: 50px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #000000; background-color: #FFFFFF; border: 2px solid #000000; border-radius: 10px; cursor: pointer; letter-spacing: 0.06em;">SIGN UP</button>
    `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('closeChoice').onclick = () => overlay.remove();
        document.getElementById('choiceLogin').onclick = () => { overlay.remove(); showLoginFormPopup(); };
        document.getElementById('choiceSignUp').onclick = () => { overlay.remove(); showSignUpFormPopup(); };
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    }

    function showLoginFormPopup() {
        const existing = document.querySelector('.login-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'login-overlay';

        const box = document.createElement('div');
        box.className = 'login-box-full';

        box.innerHTML = `
        <div class="login-close-x" id="closeFull" style="position: absolute; top: 15px; right: 20px; font-size: 28px; color: #D6D6D6; cursor: pointer;">&times;</div>
        <h2 style="margin: 0; margin-bottom: 22px; font-family: 'Epilogue', sans-serif; font-weight: 600; font-size: 24px; color: #000000;">LOG IN</h2>
        <p id="loginMsg" style="margin: 0; margin-bottom: 30px; font-family: 'Epilogue', sans-serif; font-weight: 300; font-size: 16px; color: #000000;">Sign in to your account to continue</p>
        
        <div class="form-content-wrapper">
            <span style="display: block; margin-bottom: 16px; font-family: 'Epilogue', sans-serif; font-weight: 400; font-size: 16px;">EMAIL ADDRESS</span>
            <input type="text" id="loginEmail" class="login-input-field" placeholder="Enter your email">
            <div style="height: 23px;"></div>
            <span style="display: block; margin-bottom: 16px; font-family: 'Epilogue', sans-serif; font-weight: 400; font-size: 16px;">PASSWORD</span>
            <input type="password" id="loginPass" class="login-input-field" placeholder="password">
            
            <div style="display: flex; justify-content: flex-end; width: 100%; margin-top: 20px;">
                <a href="#" id="triggerForgot" style="font-family: 'Bebas Neue'; font-size: 18px; color: #000; text-decoration: none;">FORGOT PASSWORD</a>
            </div>

            <button id="btnDoLogin" class="custom-modal-btn btn-save" style="margin-top: 30px; width: 100%; height: 55px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #000000; background-color: #F5A623; border: none; cursor: pointer;">LOG IN</button>
            <p style="margin: 0; margin-top: 36px; text-align: center; font-family: 'Epilogue', sans-serif; font-weight: 300; font-size: 16px; color: #000000;">Don't have an account?</p>
            <a href="#" id="triggerSignUp" style="display: block; text-align: center; margin-top: 35px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #000000; text-decoration: none; cursor: pointer;">SIGN UP NOW</a>
        </div>
    `;

        document.body.appendChild(overlay);
        overlay.appendChild(box);

        document.getElementById('btnDoLogin').onclick = () => {
            const email = document.getElementById('loginEmail').value.trim();
            const pass = document.getElementById('loginPass').value;
            const msg = document.getElementById('loginMsg');

            let users = JSON.parse(localStorage.getItem('primalUsers') || '[]');
            const user = users.find(u => u.email === email);

            if (!user) {
                msg.innerText = "User not found. Please Sign Up.";
                msg.style.color = "red";
            } else if (user.password !== pass) {
                msg.innerText = "Incorrect password. Try again.";
                msg.style.color = "red";
            } else {
                showSuccessNotification("LOG IN SUCCESSFUL");
                overlay.remove();
                updateUIForLogin(email);
            }
        };

        document.getElementById('closeFull').onclick = () => overlay.remove();
        document.getElementById('triggerSignUp').onclick = () => { overlay.remove(); showSignUpFormPopup(); };
        document.getElementById('triggerForgot').onclick = () => { overlay.remove(); showResetPasswordPopup(); };
    }

    function showSignUpFormPopup() {
        const existing = document.querySelector('.login-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'login-overlay';

        const box = document.createElement('div');
        box.className = 'signup-box-full';

        box.innerHTML = `
        <div class="login-close-x" id="closeSignUp" style="position: absolute; top: 15px; right: 20px; font-size: 28px; color: #D6D6D6; cursor: pointer;">&times;</div>
        <h2 style="margin: 0; margin-bottom: 22px; font-family: 'Epilogue', sans-serif; font-weight: 600; font-size: 24px; color: #000000;">SIGN UP</h2>
        <p id="signUpMsg" style="margin: 0; margin-bottom: 30px; font-family: 'Epilogue', sans-serif; font-weight: 300; font-size: 16px; color: #000000;">Please sign up to create your account</p>
        
        <div class="form-content-wrapper">
            <span style="display: block; margin-bottom: 12px; font-family: 'Epilogue', sans-serif; font-weight: 400; font-size: 16px;">EMAIL ADDRESS</span>
            <input type="text" id="regEmail" class="login-input-field" placeholder="Enter your email">
            
            <div style="height: 15px;"></div>
            
            <span style="display: block; margin-bottom: 12px; font-family: 'Epilogue', sans-serif; font-weight: 400; font-size: 16px;">PASSWORD</span>
            <input type="password" id="regPass" class="login-input-field" placeholder="password">

            <div style="height: 15px;"></div>
            
            <span style="display: block; margin-bottom: 12px; font-family: 'Epilogue', sans-serif; font-weight: 400; font-size: 16px;">CONFIRMED PASSWORD</span>
            <input type="password" id="regConfirm" class="login-input-field" placeholder="confirm password">
            
            <button id="btnDoSignUp" class="custom-modal-btn btn-save" style="margin-top: 30px; width: 100%; height: 55px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #000000; background-color: #F5A623; border: none; cursor: pointer;">SIGN UP</button>
            <p style="margin: 0; margin-top: 30px; text-align: center; font-family: 'Epilogue', sans-serif; font-weight: 300; font-size: 16px;">Already have an account?</p>
            <a href="#" id="triggerLogin" style="display: block; text-align: center; margin-top: 25px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #000000; text-decoration: none; cursor: pointer;">LOG IN NOW</a>
        </div>
    `;

        document.body.appendChild(overlay);
        overlay.appendChild(box);

        document.getElementById('btnDoSignUp').onclick = () => {
            const email = document.getElementById('regEmail').value.trim();
            const pass = document.getElementById('regPass').value;
            const confirm = document.getElementById('regConfirm').value;
            const msg = document.getElementById('signUpMsg');

            if (!email || !pass) return alert("Please fill in all fields.");
            if (pass !== confirm) return alert("Passwords do not match!");

            let users = JSON.parse(localStorage.getItem('primalUsers') || '[]');

            if (users.find(u => u.email === email)) {
                msg.innerText = "Username already exists! Please choose another.";
                msg.style.color = "red";
                return;
            }

            users.push({ email: email, password: pass, displayName: "" });
            localStorage.setItem('primalUsers', JSON.stringify(users));

            showSuccessNotification("ACCOUNT CREATED SUCCESSFULLY");
            overlay.remove();
            
            updateUIForLogin(email);
        };

        document.getElementById('closeSignUp').onclick = () => overlay.remove();
        document.getElementById('triggerLogin').onclick = () => { overlay.remove(); showLoginFormPopup(); };
    }

    function setupInteractions() {
        const sessionBtn = document.querySelector('.session-login-btn, .btn-black-full');
        if (sessionBtn) {
            sessionBtn.onclick = (e) => {
                e.preventDefault();
                if (sessionBtn.innerText === "LOG OUT") {
                    showLogoutConfirmModal();
                } else {
                    showChoicePopup();
                }
            };
        }
    }

    function showResetPasswordPopup() {
        const existing = document.querySelector('.login-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'login-overlay';

        const box = document.createElement('div');
        box.className = 'reset-box-full';

        box.innerHTML = `
        <div class="login-close-x" id="closeReset" style="position: absolute; top: 15px; right: 20px; font-size: 28px; color: #D6D6D6; cursor: pointer;">&times;</div>
        
        <h2 style="margin: 0; margin-bottom: 22px; font-family: 'Epilogue', sans-serif; font-weight: 600; font-size: 24px; color: #000000;">RESET PASSWORD</h2>
        <p style="margin: 0; margin-bottom: 40px; font-family: 'Epilogue', sans-serif; font-weight: 300; font-size: 16px; color: #000000;">Please log in to access your account</p>
        
        <div class="form-content-wrapper">
            <span style="display: block; margin-bottom: 16px; font-family: 'Epilogue', sans-serif; font-weight: 400; font-size: 16px;">EMAIL ADDRESS</span>
            <input type="text" class="login-input-field" placeholder="Enter your email">
            
            <button class="custom-modal-btn btn-save" style="margin-top: 40px; width: 100%; height: 55px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #000000; background-color: #F5A623; border: none; cursor: pointer;">LOG IN</button>
            
            <p style="margin: 0; margin-top: 36px; text-align: center; font-family: 'Epilogue', sans-serif; font-weight: 300; font-size: 16px; color: #000000;">Don't have an account?</p>
            
            <a href="#" id="resetToSignUp" style="display: block; text-align: center; margin-top: 35px; font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #000000; text-decoration: none; cursor: pointer;">SIGN UP NOW</a>
        </div>
    `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('closeReset').onclick = () => overlay.remove();

        document.getElementById('resetToSignUp').onclick = (e) => {
            e.preventDefault();
            overlay.remove();
            showSignUpFormPopup();
        };
    }

    function showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.zIndex = '10000';
        notification.style.width = '320px'; 
        notification.style.backgroundColor = '#FFFFFF';
        notification.style.border = '2px solid #000000';
        notification.style.borderRadius = '10px';
        notification.style.padding = '12px 20px'; 
        notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        notification.style.textAlign = 'center';
        notification.style.fontFamily = "'Bebas Neue', sans-serif";

        notification.innerHTML = `
        <div id="closeNotify" style="position: absolute; top: 5px; right: 12px; font-size: 20px; color: #D6D6D6; cursor: pointer;">&times;</div>
        <h2 style="margin: 0; color: #F5A623; font-size: 20px; letter-spacing: 0.05em;">${message}</h2>
    `;

        document.body.appendChild(notification);

        document.getElementById('closeNotify').onclick = () => notification.remove();

        setTimeout(() => {
            if (notification) {
                notification.style.transition = "opacity 0.5s ease";
                notification.style.opacity = "0";
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);
    }

    // ==========================================
    // 4. INITIALIZATION ROUTINE
    // ==========================================
    setupDisplayNameEdit();
    setupAvatarZoom();
    setupPersonalDetailsEdits();
    setupShippingEdits();
    setupPayments();
    setupPasswordChange();
    setupNotifications(); // <-- Added the Notification Settings popup here

    setupInteractions();

});