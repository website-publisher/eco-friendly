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

    const CURRENCY_STORAGE_KEY = 'ecoStoreCurrency';
    const CART_STORAGE_KEY = 'ecoStoreCart';
    const WISHLIST_STORAGE_KEY = 'ecoStoreWishlist';
    const FREE_SHIPPING_THRESHOLD = 3000;
    const currencyConfig = {
        INR: { symbol: '₹', rate: 1, decimals: 0 },
        USD: { symbol: '$', rate: 0.012, decimals: 2 },
        EUR: { symbol: '€', rate: 0.011, decimals: 2 }
    };

    let selectedCurrency = getStoredCurrency();
    let currentSearchQuery = '';
    let currentSearchResults = [];

    // Search elements
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResults');
    const searchResultsList = document.getElementById('searchResultsList');

    function getStoredCurrency() {
        const storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
        return currencyConfig[storedCurrency] ? storedCurrency : 'INR';
    }

    function setStoredCurrency(currencyCode) {
        selectedCurrency = currencyConfig[currencyCode] ? currencyCode : 'INR';
        localStorage.setItem(CURRENCY_STORAGE_KEY, selectedCurrency);
    }

    function formatPrice(basePrice, currencyCode = selectedCurrency) {
        const config = currencyConfig[currencyCode] || currencyConfig.INR;
        const convertedPrice = basePrice * config.rate;

        if (config.decimals === 0) {
            return `${config.symbol}${Math.round(convertedPrice)}`;
        }

        return `${config.symbol}${convertedPrice.toFixed(config.decimals)}`;
    }

    function updateVisiblePrices() {
        document.querySelectorAll('[data-base-price]').forEach(priceElement => {
            const basePrice = parseFloat(priceElement.dataset.basePrice);
            if (!Number.isNaN(basePrice)) {
                priceElement.textContent = formatPrice(basePrice);
            }
        });
    }

    function updateCurrencyButton() {
        if (!currencyButton) {
            return;
        }

        currencyButton.innerHTML = `${selectedCurrency} <span class="dropdown-arrow">▼</span>`;
    }

    function refreshSearchResults() {
        if (currentSearchQuery.length === 0) {
            return;
        }

        displaySearchResults(currentSearchResults);
    }

    function syncCurrencyUi() {
        updateCurrencyButton();
        updateVisiblePrices();
        renderCartItems();
        renderWishlistItems();
        refreshSearchResults();
    }

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
                li.textContent = `${product.name} - ${formatPrice(product.price)}`;
                li.addEventListener('click', () => {
                    const targetUrl = `${product.url}?q=${encodeURIComponent(product.name)}`;
                    window.location.href = targetUrl;
                });
                searchResultsList.appendChild(li);
            });
        }

        searchResultsContainer.style.display = 'block'; // Show results
    }

    // Event listener for search input
    searchInput.addEventListener('input', () => {
        currentSearchQuery = searchInput.value.trim();
        if (currentSearchQuery.length > 0) {
            currentSearchResults = searchProducts(currentSearchQuery);
            displaySearchResults(currentSearchResults);
        } else {
            currentSearchResults = [];
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
        currentSearchQuery = searchInput.value.trim();
        if (currentSearchQuery.length > 0) {
            currentSearchResults = searchProducts(currentSearchQuery);
            displaySearchResults(currentSearchResults);

            if (window.location.pathname.toLowerCase().includes('products.html')) {
                searchInput.blur();
            } else {
                const queryUrl = `products.html?q=${encodeURIComponent(currentSearchQuery)}`;
                window.location.href = queryUrl;
            }
        }
    });

    function initializeProductCatalogControls() {
        const productList = document.querySelector('#products .product-list');
        if (!productList) {
            return;
        }

        const filterInput = document.getElementById('productsFilterInput');
        const sortSelect = document.getElementById('productsSortSelect');
        const priceFilter = document.getElementById('productsPriceFilter');
        const resetButton = document.getElementById('productsResetFilters');
        const activeFilters = document.getElementById('productsActiveFilters');
        const resultCount = document.getElementById('productsResultCount');
        const emptyState = document.getElementById('productsEmptyState');

        if (!filterInput || !sortSelect || !priceFilter || !resetButton || !activeFilters || !resultCount || !emptyState) {
            return;
        }

        const productCards = Array.from(productList.querySelectorAll('.product'));
        const indexedProducts = productCards.map((card, index) => {
            const titleElement = card.querySelector('h3');
            const priceElement = card.querySelector('[data-base-price]');

            return {
                card,
                originalIndex: index,
                title: titleElement ? titleElement.textContent.trim().toLowerCase() : '',
                basePrice: priceElement ? parseFloat(priceElement.dataset.basePrice) : 0
            };
        });

        function parsePriceRange(value) {
            if (value === 'all') {
                return { min: -Infinity, max: Infinity };
            }

            const [min, max] = value.split('-').map(Number);
            return {
                min: Number.isFinite(min) ? min : -Infinity,
                max: Number.isFinite(max) ? max : Infinity
            };
        }

        function getPriceLabel(value) {
            const option = priceFilter.querySelector(`option[value="${value}"]`);
            return option ? option.textContent.trim() : 'Price range';
        }

        function getSortLabel(value) {
            const option = sortSelect.querySelector(`option[value="${value}"]`);
            return option ? option.textContent.trim() : 'Featured';
        }

        function syncCatalogUrl(query, sortValue, priceValue) {
            const currentUrl = new URL(window.location.href);

            if (query) {
                currentUrl.searchParams.set('q', query);
            } else {
                currentUrl.searchParams.delete('q');
            }

            if (sortValue && sortValue !== 'featured') {
                currentUrl.searchParams.set('sort', sortValue);
            } else {
                currentUrl.searchParams.delete('sort');
            }

            if (priceValue && priceValue !== 'all') {
                currentUrl.searchParams.set('price', priceValue);
            } else {
                currentUrl.searchParams.delete('price');
            }

            history.replaceState(null, '', currentUrl.toString());
        }

        function renderFilterChips(query, sortValue, priceValue) {
            const chips = [];

            if (query) {
                chips.push(`<span class="filter-chip">Search: ${query} <button type="button" data-remove-filter="q" aria-label="Clear search filter">x</button></span>`);
            }

            if (sortValue !== 'featured') {
                chips.push(`<span class="filter-chip">Sort: ${getSortLabel(sortValue)} <button type="button" data-remove-filter="sort" aria-label="Reset sort filter">x</button></span>`);
            }

            if (priceValue !== 'all') {
                chips.push(`<span class="filter-chip">Price: ${getPriceLabel(priceValue)} <button type="button" data-remove-filter="price" aria-label="Clear price filter">x</button></span>`);
            }

            activeFilters.innerHTML = chips.join('');
            activeFilters.hidden = chips.length === 0;
        }

        function applyProductControls() {
            const rawQuery = filterInput.value.trim();
            const query = rawQuery.toLowerCase();
            const sortValue = sortSelect.value;
            const selectedRange = parsePriceRange(priceFilter.value);

            const visibleProducts = indexedProducts.filter(item => {
                const matchesQuery = query.length === 0 || item.title.includes(query);
                const matchesRange = item.basePrice >= selectedRange.min && item.basePrice <= selectedRange.max;
                const isVisible = matchesQuery && matchesRange;

                item.card.classList.toggle('is-hidden', !isVisible);
                return isVisible;
            });

            const sortedVisibleProducts = [...visibleProducts].sort((a, b) => {
                if (sortValue === 'price-asc') {
                    return a.basePrice - b.basePrice;
                }

                if (sortValue === 'price-desc') {
                    return b.basePrice - a.basePrice;
                }

                if (sortValue === 'name-asc') {
                    return a.title.localeCompare(b.title);
                }

                return a.originalIndex - b.originalIndex;
            });

            sortedVisibleProducts.forEach(item => {
                productList.appendChild(item.card);
            });

            resultCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? '' : 's'} shown`;
            emptyState.hidden = visibleProducts.length !== 0;
            renderFilterChips(rawQuery, sortValue, priceFilter.value);
            syncCatalogUrl(rawQuery, sortValue, priceFilter.value);
        }

        resetButton.addEventListener('click', () => {
            filterInput.value = '';
            sortSelect.value = 'featured';
            priceFilter.value = 'all';
            applyProductControls();
        });

        activeFilters.addEventListener('click', (event) => {
            const removeButton = event.target.closest('button[data-remove-filter]');
            if (!removeButton) {
                return;
            }

            const target = removeButton.dataset.removeFilter;
            if (target === 'q') {
                filterInput.value = '';
            } else if (target === 'sort') {
                sortSelect.value = 'featured';
            } else if (target === 'price') {
                priceFilter.value = 'all';
            }

            applyProductControls();
        });

        filterInput.addEventListener('input', applyProductControls);
        sortSelect.addEventListener('change', applyProductControls);
        priceFilter.addEventListener('change', applyProductControls);

        const pageParams = new URLSearchParams(window.location.search);
        const pageQuery = pageParams.get('q');
        const pageSort = pageParams.get('sort');
        const pagePrice = pageParams.get('price');

        if (pageQuery) {
            filterInput.value = pageQuery;
        }

        if (pageSort && sortSelect.querySelector(`option[value="${pageSort}"]`)) {
            sortSelect.value = pageSort;
        }

        if (pagePrice && priceFilter.querySelector(`option[value="${pagePrice}"]`)) {
            priceFilter.value = pagePrice;
        }

        applyProductControls();
    }

    function showToast(message, type = 'info') {
        let toastRoot = document.querySelector('.eco-toast-root');
        if (!toastRoot) {
            toastRoot = document.createElement('div');
            toastRoot.className = 'eco-toast-root';
            toastRoot.setAttribute('aria-live', 'polite');
            toastRoot.setAttribute('aria-atomic', 'true');
            document.body.appendChild(toastRoot);
        }

        const toast = document.createElement('div');
        toast.className = `eco-toast eco-toast-${type}`;
        toast.textContent = message;
        toastRoot.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 200);
        }, 2200);
    }

    function initializeProductQuantityControls() {
        const productCards = document.querySelectorAll('#products .product');
        if (productCards.length === 0) {
            return;
        }

        productCards.forEach(card => {
            if (card.querySelector('.product-qty')) {
                return;
            }

            const actions = card.querySelector('.product-actions');
            if (!actions) {
                return;
            }

            const qtyWrap = document.createElement('div');
            qtyWrap.className = 'product-qty';

            const minusButton = document.createElement('button');
            minusButton.type = 'button';
            minusButton.className = 'qty-btn qty-minus';
            minusButton.setAttribute('aria-label', 'Decrease quantity');
            minusButton.textContent = '-';

            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.className = 'qty-input';
            qtyInput.min = '1';
            qtyInput.max = '20';
            qtyInput.step = '1';
            qtyInput.value = '1';
            qtyInput.setAttribute('aria-label', 'Product quantity');

            const plusButton = document.createElement('button');
            plusButton.type = 'button';
            plusButton.className = 'qty-btn qty-plus';
            plusButton.setAttribute('aria-label', 'Increase quantity');
            plusButton.textContent = '+';

            minusButton.addEventListener('click', () => {
                const nextValue = Math.max(1, Number(qtyInput.value || 1) - 1);
                qtyInput.value = String(nextValue);
            });

            plusButton.addEventListener('click', () => {
                const nextValue = Math.min(20, Number(qtyInput.value || 1) + 1);
                qtyInput.value = String(nextValue);
            });

            qtyInput.addEventListener('input', () => {
                const normalized = Number(qtyInput.value);
                if (!Number.isFinite(normalized) || normalized < 1) {
                    qtyInput.value = '1';
                    return;
                }

                if (normalized > 20) {
                    qtyInput.value = '20';
                }
            });

            qtyWrap.appendChild(minusButton);
            qtyWrap.appendChild(qtyInput);
            qtyWrap.appendChild(plusButton);

            actions.parentNode.insertBefore(qtyWrap, actions);
        });
    }

// Cart structure
let cart = [];

// Cart element references
const cartIcon = document.querySelector('.cart-link');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
let cartShippingMessage = null;
let cartShippingBar = null;

    function loadStoredCollection(key, fallback = []) {
        try {
            const rawValue = localStorage.getItem(key);
            if (!rawValue) {
                return fallback;
            }

            const parsed = JSON.parse(rawValue);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function saveStoredCollection(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function ensureCartProgressElements() {
        if (cartShippingMessage && cartShippingBar) {
            return;
        }

        const cartContent = cartTotalElement ? cartTotalElement.closest('.cart-content') : null;
        if (!cartContent) {
            return;
        }

        let summary = cartContent.querySelector('.cart-shipping-summary');
        if (!summary) {
            summary = document.createElement('div');
            summary.className = 'cart-shipping-summary';
            summary.innerHTML = `
                <p id="cartShippingMessage"></p>
                <div class="shipping-progress" aria-hidden="true">
                    <span id="cartShippingBar"></span>
                </div>
            `;

            const clearButton = document.getElementById('clearCart');
            cartContent.insertBefore(summary, clearButton);
        }

        cartShippingMessage = summary.querySelector('#cartShippingMessage');
        cartShippingBar = summary.querySelector('#cartShippingBar');
    }

    function updateCartShippingProgress(totalBasePrice) {
        ensureCartProgressElements();
        if (!cartShippingMessage || !cartShippingBar) {
            return;
        }

        const progress = Math.min(100, Math.round((totalBasePrice / FREE_SHIPPING_THRESHOLD) * 100));
        const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totalBasePrice);
        cartShippingBar.style.width = `${progress}%`;

        if (totalBasePrice >= FREE_SHIPPING_THRESHOLD) {
            cartShippingMessage.textContent = 'You unlocked free shipping for this order.';
            return;
        }

        cartShippingMessage.textContent = `${formatPrice(remaining)} away from free shipping.`;
    }

    cart = loadStoredCollection(CART_STORAGE_KEY).map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1
    }));

    // Function to update cart count (in the icon)
    function updateCartCount() {
        const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartIcon.querySelector('.cart-count').textContent = totalCount;
    }

    // Function to render cart items in the modal
    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear previous items
        const totalBasePrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (cart.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'cart-empty';
            emptyItem.textContent = 'Your cart is currently empty.';
            cartItemsContainer.appendChild(emptyItem);
        }

        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';

            const itemInfo = document.createElement('div');
            itemInfo.className = 'cart-item-info';

            const itemName = document.createElement('p');
            itemName.className = 'cart-item-name';
            itemName.textContent = item.name;

            const itemPrice = document.createElement('p');
            itemPrice.className = 'cart-item-price';
            itemPrice.textContent = `${formatPrice(item.price)} each`;

            itemInfo.appendChild(itemName);
            itemInfo.appendChild(itemPrice);

            const itemControls = document.createElement('div');
            itemControls.className = 'cart-item-controls';

            const qtyControl = document.createElement('div');
            qtyControl.className = 'cart-item-qty';

            const minusButton = document.createElement('button');
            minusButton.type = 'button';
            minusButton.textContent = '-';
            minusButton.setAttribute('aria-label', 'Decrease cart quantity');
            minusButton.dataset.action = 'decrement';
            minusButton.dataset.id = item.id;

            const qtyValue = document.createElement('span');
            qtyValue.textContent = String(item.quantity);

            const plusButton = document.createElement('button');
            plusButton.type = 'button';
            plusButton.textContent = '+';
            plusButton.setAttribute('aria-label', 'Increase cart quantity');
            plusButton.dataset.action = 'increment';
            plusButton.dataset.id = item.id;

            qtyControl.appendChild(minusButton);
            qtyControl.appendChild(qtyValue);
            qtyControl.appendChild(plusButton);

            const lineTotal = document.createElement('p');
            lineTotal.className = 'cart-item-total';
            lineTotal.textContent = formatPrice(item.price * item.quantity);

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = 'Remove';
            removeButton.dataset.action = 'remove';
            removeButton.dataset.id = item.id;

            itemControls.appendChild(qtyControl);
            itemControls.appendChild(lineTotal);
            itemControls.appendChild(removeButton);

            li.appendChild(itemInfo);
            li.appendChild(itemControls);
            cartItemsContainer.appendChild(li);
        });

        cartTotalElement.textContent = formatPrice(totalBasePrice); // Update total price
        updateCartShippingProgress(totalBasePrice);
    }

    function changeCartItemQuantity(id, delta) {
        const targetItem = cart.find(item => item.id == id);
        if (!targetItem) {
            return;
        }

        targetItem.quantity += delta;

        if (targetItem.quantity <= 0) {
            cart = cart.filter(item => item.id != id);
        }

        saveStoredCollection(CART_STORAGE_KEY, cart);
        updateCartCount();
        renderCartItems();
    }

    // Function to add an item to the cart
    function addItemToCart(id, name, price, quantity = 1) {
        const normalizedQty = Number.isFinite(Number(quantity)) && Number(quantity) > 0 ? Math.floor(Number(quantity)) : 1;
        const existingItem = cart.find(item => item.id == id);
        if (existingItem) {
            existingItem.quantity += normalizedQty;
        } else {
            cart.push({ id, name, price, quantity: normalizedQty });
        }
        saveStoredCollection(CART_STORAGE_KEY, cart);
        updateCartCount();
        renderCartItems(); // Re-render the cart items after adding
        showToast(`${normalizedQty} item${normalizedQty > 1 ? 's' : ''} added to cart`, 'success');
    }

    // Function to remove an item from the cart
    function removeItemFromCart(id) {
        cart = cart.filter(item => item.id != id);
        saveStoredCollection(CART_STORAGE_KEY, cart);
        updateCartCount();
        renderCartItems();
        showToast('Item removed from cart', 'info');
    }

    // Function to clear the entire cart
    function clearCart() {
        cart = [];
        saveStoredCollection(CART_STORAGE_KEY, cart);
        updateCartCount();
        renderCartItems();
        showToast('Cart cleared', 'info');
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

    cartItemsContainer.addEventListener('click', (event) => {
        const actionButton = event.target.closest('button[data-action]');
        if (!actionButton) {
            return;
        }

        const itemId = actionButton.dataset.id;
        const action = actionButton.dataset.action;

        if (action === 'increment') {
            changeCartItemQuantity(itemId, 1);
            return;
        }

        if (action === 'decrement') {
            changeCartItemQuantity(itemId, -1);
            return;
        }

        if (action === 'remove') {
            removeItemFromCart(itemId);
        }
    });

    // Adding item to cart (example button, assuming item buttons have the class 'add-to-cart')
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.getAttribute('data-id');
            const itemName = button.getAttribute('data-name');
            const itemPrice = parseFloat(button.getAttribute('data-price'));
            const qtyInput = button.closest('.product')?.querySelector('.qty-input');
            const quantity = qtyInput ? Number(qtyInput.value) : 1;
            addItemToCart(itemId, itemName, itemPrice, quantity);
        });
    });

    // Wishlist structure
    let wishlist = [];

    // Wishlist element references
    const wishlistIcon = document.querySelector('.wishlist-link');
    const wishlistModal = document.getElementById('wishlistModal');
    const wishlistItemsContainer = document.getElementById('wishlistItems');

    wishlist = loadStoredCollection(WISHLIST_STORAGE_KEY).map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0
    }));

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
            li.textContent = `${item.name} - ${formatPrice(item.price)}`;

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
            saveStoredCollection(WISHLIST_STORAGE_KEY, wishlist);
            updateWishlistCount();
            renderWishlistItems(); // Re-render the wishlist items after adding
            showToast('Added to wishlist', 'success');
        } else {
            showToast('Already in wishlist', 'info');
        }
    }

    // Function to remove an item from the wishlist
    function removeItemFromWishlist(id) {
        wishlist = wishlist.filter(item => item.id !== id);
        saveStoredCollection(WISHLIST_STORAGE_KEY, wishlist);
        updateWishlistCount();
        renderWishlistItems();
        showToast('Removed from wishlist', 'info');
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

    if (currencyButton && currencyOptions) {
        updateCurrencyButton();
        updateVisiblePrices();

        currencyButton.addEventListener('click', () => {
            const isActive = currencyOptions.classList.toggle('active');
            currencyButton.closest('.currency-switcher').classList.toggle('active', isActive);
        });

        const currencyButtons = document.querySelectorAll('.currency-options button');

        currencyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedCurrencyCode = button.textContent.split(' ')[0];
                setStoredCurrency(selectedCurrencyCode);
                syncCurrencyUi();
                currencyOptions.classList.remove('active');
                currencyButton.closest('.currency-switcher').classList.remove('active');
            });
        });

        // Close options if clicking outside
        document.addEventListener('click', function (event) {
            if (!currencyButton.contains(event.target) && !currencyOptions.contains(event.target)) {
                currencyOptions.classList.remove('active'); // Hide options
                currencyButton.closest('.currency-switcher').classList.remove('active');
            }
        });
    }

    // Close promo bar
    const closePromo = document.querySelector('.close-promo');
    const promoBar = document.querySelector('.promo-bar');
    if (closePromo && promoBar) {
        closePromo.addEventListener('click', () => {
            promoBar.style.display = 'none';
        });
    }

    initializeProductCatalogControls();
    initializeProductQuantityControls();
    updateCartCount();
    renderCartItems();
    updateWishlistCount();
    renderWishlistItems();
});