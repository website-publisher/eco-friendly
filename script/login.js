document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const USERS_KEY = "ecoStoreUsers";
    const CURRENT_USER_KEY = "ecoStoreCurrentUser";

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        // Simple validation
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        const users = getUsers();
        const matchedUser = users.find(
            (user) => user.email === email && user.password === password
        );

        if (!matchedUser) {
            alert("Invalid email or password. Please try again.");
            return;
        }

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify({
                name: matchedUser.name,
                email: matchedUser.email,
                loggedInAt: new Date().toISOString()
            })
        );

        alert("Login successful! Welcome back, " + matchedUser.name + ".");
        window.location.href = "index.html";
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