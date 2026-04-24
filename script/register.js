document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector(".register-form"); // Updated selector to match your form class
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const USERS_KEY = "ecoStoreUsers";

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Simple validation
        if (name === "") {
            alert("Please enter your name.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        const users = getUsers();
        const normalizedEmail = email.toLowerCase();

        if (users.some((user) => user.email === normalizedEmail)) {
            alert("An account with this email already exists. Please log in.");
            window.location.href = "login.html";
            return;
        }

        users.push({
            name,
            email: normalizedEmail,
            password,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        alert("Registration successful! Welcome, " + name + "!");
        
        // Redirect to login page after successful registration (optional)
        window.location.href = "login.html"; // Updated path to the login page
    });

    function getUsers() {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (!storedUsers) {
            return [];
        }

        try {
            const parsedUsers = JSON.parse(storedUsers);
            return Array.isArray(parsedUsers) ? parsedUsers : [];
        } catch (error) {
            return [];
        }
    }

    function validateEmail(email) {
        // Simple email regex for validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});
