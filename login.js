
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const loginBtn = document.getElementById('login-btn');
        const loginForm = document.getElementById('login-form');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
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
            const isEmailValid = validateInput(emailInput, emailRegex, document.getElementById('email-error'), "Invalid email format");
            const isPasswordValid = passwordInput.value.trim().length > 0;

            loginBtn.disabled = !(isEmailValid && isPasswordValid);
        }

        async function hashPassword(password) {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join('');
        }

        loginForm.addEventListener('input', validateForm);

        loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.email === email);
    if (!user) {
        document.getElementById('email-error').textContent = "Email not registered";
        return;
    }

    const hashedPassword = await hashPassword(password);
    if (user.password !== hashedPassword) {
        document.getElementById('password-error').textContent = "Incorrect password";
        return;
    }

    // Store the user's name in localStorage for use on index.html
    localStorage.setItem('loggedInUser', user.name);

    // Redirect to index.html
    window.location.href = "index.html";
});


        function showForgotPassword() {
            document.getElementById('forgot-password-section').style.display = 'block';
        }

        function sendOTP() {
            const email = document.getElementById('reset-email').value.trim();
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email);

            if (!user) {
                document.getElementById('otp-message').textContent = "Email not found.";
                return;
            }

            const otp = Math.floor(100000 + Math.random() * 900000);
            localStorage.setItem('otp', JSON.stringify({ email, otp }));
            alert(`Your OTP is: ${otp} (Simulated OTP)`);

            document.getElementById('otp-input').style.display = 'block';
            document.getElementById('new-password').style.display = 'block';
            document.getElementById('reset-btn').style.display = 'block';
            document.getElementById('otp-message').textContent = "OTP sent!";
        }

        async function resetPassword() {
            const email = document.getElementById('reset-email').value.trim();
            const otp = document.getElementById('otp-input').value.trim();
            const newPassword = document.getElementById('new-password').value;

            let otpData = JSON.parse(localStorage.getItem('otp'));
            if (!otpData || otpData.email !== email || otpData.otp.toString() !== otp) {
                document.getElementById('otp-message').textContent = "Invalid OTP.";
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === email);

            if (userIndex === -1) {
                document.getElementById('otp-message').textContent = "User not found.";
                return;
            }

            users[userIndex].password = await hashPassword(newPassword);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.removeItem('otp');

            alert("Password reset successful! You can now log in.");
            window.location.reload();
        }
