document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // formate id: 1, name: "Eco Water Bottle", price: 499, url: "products.html"
    const products = [
        { id: 1, name: "Bhumi - Terracotta Clay Water bottle - 1L", price: 800, url: "products.html" },
        { id: 2, name: "Bamboo Wired Mouse Mini Optical USB Interface (Orange)", price: 2000, url: "products.html" },
        { id: 3, name: "Handcrafted Terracotta T’ Time Cups - Set of 2, 350ml", price: 300, url: "products.html" },
        { id: 4, name: "'LIT'le Diwali Delights", price: 900, url: "products.html" },
        { id: 5, name: "Serene Splendour Gift Hamper", price: 7000, url: "products.html" },
        { id: 6, name: "Festival of Lights Gift Hamper", price: 4000, url: "products.html" },
        { id: 7, name: "Manthan Porcelain Mug - Multicolour, Churn", price: 1000, url: "products.html" },
        { id: 8, name: "Manthan Porcelain Mug - Multicolour, Ocean", price: 1000, url: "products.html" },
        { id: 9, name: "Manthan Porcelain Mugs - Set of 2, Multicolour, Churn & Ocean", price: 2000, url: "products.html" },
    ];

// Search elements
const searchInput = document.getElementById('searchInput');
const searchResultsContainer = document.getElementById('searchResults');
const searchResultsList = document.getElementById('searchResultsList');

// Function to filter products based on search query
function searchProducts(query) {
    return products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );
}

// Function to display search results
function displaySearchResults(results) {
    searchResultsList.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        searchResultsList.innerHTML = '<li>No products found</li>';
    } else {
        results.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - ₹${product.price}`;
            li.addEventListener('click', () => {
                window.location.href = product.url; // Navigate to product page
            });
            searchResultsList.appendChild(li);
        });
    }

    searchResultsContainer.style.display = 'block'; // Show results
}

// Event listener for search input
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        const results = searchProducts(query);
        displaySearchResults(results);
    } else {
        searchResultsContainer.style.display = 'none'; // Hide results if query is empty
    }
});

// Hide search results when clicking outside
document.addEventListener('click', function (event) {
    if (!searchResultsContainer.contains(event.target) && !searchInput.contains(event.target)) {
        searchResultsContainer.style.display = 'none';
    }
});

// Prevent form submission (optional, if you want to handle search dynamically)
document.querySelector('.search-bar').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query.length > 0) {
        const results = searchProducts(query);
        displaySearchResults(results);
    }
});

// Cart structure
let cart = [];

// Cart element references
const cartIcon = document.querySelector('.cart-link');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');

// Function to update cart count (in the icon)
function updateCartCount() {
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartIcon.querySelector('.cart-count').textContent = totalCount;
}

// Function to render cart items in the modal
function renderCartItems() {
    cartItemsContainer.innerHTML = ''; // Clear previous items
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ₹${item.price} x ${item.quantity}`;
        total += item.price * item.quantity;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            removeItemFromCart(item.id);
        };
        li.appendChild(removeButton);
        cartItemsContainer.appendChild(li);
    });

    cartTotalElement.textContent = `₹${total}`; // Update total price
}

// Function to add an item to the cart
function addItemToCart(id, name, price) {
    const existingItem = cart.find(item => item.id == id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartCount();
    renderCartItems(); // Re-render the cart items after adding
}

// Function to remove an item from the cart
function removeItemFromCart(id) {
    cart = cart.filter(item => item.id != id);
    updateCartCount();
    renderCartItems();
}

// Function to clear the entire cart
function clearCart() {
    cart = [];
    updateCartCount();
    renderCartItems();
}

// Event listener for the cart icon to show the modal
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('show'); // Add class to show the modal
    renderCartItems(); // Render the current cart items
});

// Close cart modal when the close button is clicked
document.getElementById('closeCart').addEventListener('click', () => {
    cartModal.classList.remove('show'); // Hide the modal
});

// Close cart modal when clicking outside of it
document.addEventListener('click', function (event) {
    if (!cartModal.contains(event.target) && cartModal.classList.contains('show') && !cartIcon.contains(event.target)) {
        cartModal.classList.remove('show'); // Hide modal if clicked outside
    }
});

// Close cart modal when pressing the "Escape" key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && cartModal.classList.contains('show')) {
        cartModal.classList.remove('show'); // Hide modal on Escape key
    }
});

// Clear cart button functionality
document.getElementById('clearCart').addEventListener('click', clearCart);

// Adding item to cart (example button, assuming item buttons have the class 'add-to-cart')
document.querySelectorAll('.btn-add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-id');
        const itemName = button.getAttribute('data-name');
        const itemPrice = parseFloat(button.getAttribute('data-price'));
        addItemToCart(itemId, itemName, itemPrice);
    });
});

// Wishlist structure
let wishlist = [];

// Wishlist element references
const wishlistIcon = document.querySelector('.wishlist-link');
const wishlistModal = document.getElementById('wishlistModal');
const wishlistItemsContainer = document.getElementById('wishlistItems');

// Function to update wishlist count (in the icon)
function updateWishlistCount() {
    const totalCount = wishlist.length;
    wishlistIcon.querySelector('.wishlist-count').textContent = totalCount;
}

// Function to render wishlist items in the modal
function renderWishlistItems() {
    wishlistItemsContainer.innerHTML = ''; // Clear previous items

    wishlist.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ₹${item.price}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            removeItemFromWishlist(item.id);
        };
        li.appendChild(removeButton);
        wishlistItemsContainer.appendChild(li);
    });
}

// Function to add an item to the wishlist
function addItemToWishlist(id, name, price) {
    const existingItem = wishlist.find(item => item.id === id);
    if (!existingItem) {
        wishlist.push({ id, name, price });
        updateWishlistCount();
        renderWishlistItems(); // Re-render the wishlist items after adding
    }
}

// Function to remove an item from the wishlist
function removeItemFromWishlist(id) {
    wishlist = wishlist.filter(item => item.id !== id);
    updateWishlistCount();
    renderWishlistItems();
}

// Event listener for the wishlist icon to show the modal
wishlistIcon.addEventListener('click', () => {
    wishlistModal.classList.add('show'); // Add class to show the modal
    renderWishlistItems(); // Render the current wishlist items
});

// Close wishlist modal when the close button is clicked
document.getElementById('closeWishlist').addEventListener('click', () => {
    wishlistModal.classList.remove('show'); // Hide the modal
});

// Close wishlist modal when clicking outside of it
document.addEventListener('click', function (event) {
    if (!wishlistModal.contains(event.target) && wishlistModal.classList.contains('show') && !wishlistIcon.contains(event.target)) {
        wishlistModal.classList.remove('show'); // Hide modal if clicked outside
    }
});

// Close wishlist modal when pressing the "Escape" key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && wishlistModal.classList.contains('show')) {
        wishlistModal.classList.remove('show'); // Hide modal on Escape key
    }
});

// Adding item to wishlist (example button, assuming item buttons have the class 'add-to-wishlist')
document.querySelectorAll('.btn-add-to-wishlist').forEach(button => {
    button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-id');
        const itemName = button.getAttribute('data-name');
        const itemPrice = parseFloat(button.getAttribute('data-price'));
        addItemToWishlist(itemId, itemName, itemPrice);
    });
});

// Currency switcher
const currencyButton = document.querySelector('.current-currency');
const currencyOptions = document.querySelector('.currency-options');

currencyButton.addEventListener('click', () => {
    const isActive = currencyOptions.classList.toggle('active');
    currencyButton.closest('.currency-switcher').classList.toggle('active', isActive);
});

const currencyButtons = document.querySelectorAll('.currency-options button');

currencyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedCurrency = button.textContent.split(' ')[0]; // Extract the currency code
        currencyButton.innerHTML = `${selectedCurrency} <span class="dropdown-arrow">▼</span>`; // Update button text
        currencyOptions.classList.remove('active'); // Hide options after selection
        currencyButton.closest('.currency-switcher').classList.remove('active');
        console.log(`Currency switched to: ${selectedCurrency}`); // Log for debugging
    });
});

// Close options if clicking outside
document.addEventListener('click', function (event) {
    if (!currencyButton.contains(event.target) && !currencyOptions.contains(event.target)) {
        currencyOptions.classList.remove('active'); // Hide options
        currencyButton.closest('.currency-switcher').classList.remove('active');
    }
});

// Close promo bar
const closePromo = document.querySelector('.close-promo');
const promoBar = document.querySelector('.promo-bar');
closePromo.addEventListener('click', () => {
    promoBar.style.display = 'none';
});
});