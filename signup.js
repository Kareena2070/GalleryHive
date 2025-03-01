
        const nameInput = document.getElementById('signup-name');
        const emailInput = document.getElementById('signup-email');
        const passwordInput = document.getElementById('signup-password');
        const contactInput = document.getElementById('signup-contact');
        const signupBtn = document.getElementById('signup-btn');
        const signupForm = document.getElementById('signup-form');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        const contactRegex = /^\+\d{1,3}\s\d{10}$/; // Enforces country code (e.g., +91 9876543210)

        function validateInput(input, regex, errorElement, errorMessage) {
            if (!regex.test(input.value.trim())) {
                errorElement.textContent = errorMessage;
                return false;
            } else {
                errorElement.textContent = "";
                return true;
            }
        }

        function validateForm() {
            const isNameValid = nameInput.value.trim().length > 0;
            const isEmailValid = validateInput(emailInput, emailRegex, document.getElementById('email-error'), "Invalid email format");
            const isPasswordValid = validateInput(passwordInput, passwordRegex, document.getElementById('password-error'), "8-16 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char");
            const isContactValid = validateInput(contactInput, contactRegex, document.getElementById('contact-error'), "Use format: +91 9876543210");

            signupBtn.disabled = !(isNameValid && isEmailValid && isPasswordValid && isContactValid);
        }

        async function hashPassword(password) {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join('');
        }

        signupForm.addEventListener('input', validateForm);

        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const contact = contactInput.value.trim();

            let users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.some(user => user.email === email)) {
                document.getElementById('email-error').textContent = "Email already registered";
                return;
            }

            const hashedPassword = await hashPassword(password);

            users.push({ name, email, password: hashedPassword, contact });
            localStorage.setItem('users', JSON.stringify(users));

            alert("Signup successful! Redirecting to login.");
            window.location.href = "login.html";
        });
    