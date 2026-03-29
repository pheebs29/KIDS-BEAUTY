// ==================== PRODUCT DATABASE ====================
const products = [
    // Clothing (ages 5-17)
    { id: 1, name: "Graphic Dino Tee", category: "clothing", price: 12.90, img: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=300&h=220&fit=crop" },
    { id: 2, name: "Striped Hoodie", category: "clothing", price: 17.99, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=220&fit=crop" },
    { id: 3, name: "Denim Jacket (Teen)", category: "clothing", price: 19.00, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=220&fit=crop" },
    { id: 4, name: "Summer Shorts Set", category: "clothing", price: 7.99, img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300&h=220&fit=crop" },
    { id: 5, name: "Floral Dress (5-10y)", category: "clothing", price: 15.50, img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=300&h=220&fit=crop" },
    // Bags
    { id: 6, name: "Kids Backpack - Rainbow", category: "bags", price: 10.50, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=220&fit=crop" },
    { id: 7, name: "Unicorn Crossbody", category: "bags", price: 9.99, img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=220&fit=crop" },
    { id: 8, name: "Canvas Tote (Teen)", category: "bags", price: 8.99, img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=220&fit=crop" },
    { id: 9, name:"kids Backpack - cartoon bags", category:"bags", price: 9.87,img: "https://pictures-ghana.jijistatic.net/56262253_MTYwMC0xNzEwLTUxNzIwZDRiOTc.webp"}
    // Accessories
    { id: 10, name: "Star Sunglasses", category: "accessories", price: 4.99, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=220&fit=crop" },
    { id: 11, name: "Friendship Bracelet Set", category: "accessories", price: 2.99, img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=220&fit=crop" },
    { id: 12, name: "Glitter Hair Clips (5pk)", category: "accessories", price: 3.49, img: "https://images.unsplash.com/photo-1635732964493-0c9a13ea4e2b?w=300&h=220&fit=crop" },
    { id: 13, name: "LED Light Up Sneakers", category: "clothing", price: 19.99, img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&h=220&fit=crop" }
];

// ==================== CART STATE ====================
let cart = [];  // each item: { id, name, price, quantity }

// Helper: Save cart to localStorage
function saveCart() {
    localStorage.setItem("kidsBeautyCart", JSON.stringify(cart));
}

// Helper: Load cart from localStorage
function loadCart() {
    const stored = localStorage.getItem("kidsBeautyCart");
    if (stored) {
        cart = JSON.parse(stored);
    } else {
        cart = [];
    }
    updateCartUI();
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            quantity: 1 
        });
    }
    saveCart();
    updateCartUI();
    // Flash effect on cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.1)';
    setTimeout(() => { cartIcon.style.transform = ''; }, 200);
}

// Update cart quantity (increase/decrease)
function updateQuantity(id, delta) {
    const itemIndex = cart.findIndex(i => i.id === id);
    if (itemIndex === -1) return;
    const newQuantity = cart[itemIndex].quantity + delta;
    if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
    } else {
        cart[itemIndex].quantity = newQuantity;
    }
    saveCart();
    updateCartUI();
}

// Remove item completely
function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
}

// Calculate total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Update cart sidebar + cart count
function updateCartUI() {
    const cartCountSpan = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    cartCountSpan.innerText = totalItems;
    
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; padding:2rem;">Your cart is empty 🛍️</p>';
        cartTotalSpan.innerText = '0.00';
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-decr">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-incr">+</button>
                    <button class="remove-item"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
    });
    cartItemsContainer.innerHTML = html;
    cartTotalSpan.innerText = getCartTotal().toFixed(2);
    
    // Attach event listeners to dynamically created buttons
    document.querySelectorAll('.qty-decr').forEach((btn, idx) => {
        btn.addEventListener('click', () => updateQuantity(cart[idx].id, -1));
    });
    document.querySelectorAll('.qty-incr').forEach((btn, idx) => {
        btn.addEventListener('click', () => updateQuantity(cart[idx].id, 1));
    });
    document.querySelectorAll('.remove-item').forEach((btn, idx) => {
        btn.addEventListener('click', () => removeItem(cart[idx].id));
    });
}

// ==================== RENDER PRODUCTS WITH FILTER ====================
let currentFilter = "all";

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    let filtered = products;
    if (currentFilter !== "all") {
        filtered = products.filter(p => p.category === currentFilter);
    }
    
    let html = '';
    filtered.forEach(product => {
        html += `
            <div class="product-card" data-category="${product.category}">
                <img class="product-img" src="${product.img}" alt="${product.name}" loading="lazy">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
    });
    grid.innerHTML = html;
    
    // Attach add-to-cart events
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

// ==================== FILTER BUTTONS ====================
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-category');
            renderProducts();
        });
    });
}

// ==================== CART SIDEBAR TOGGLE ====================
function initCartSidebar() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('open');
        });
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
        // Click outside to close? optional: add overlay but fine for simplicity
    }
    
    // Checkout button (demo reset)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty! Add some cute items.");
                return;
            }
            alert(`🎉 Thanks for shopping at KIDS BEAUTY BY P!\nTotal: $${getCartTotal().toFixed(2)}\n(This is a demo. Cart will reset.)`);
            cart = [];
            saveCart();
            updateCartUI();
            cartSidebar.classList.remove('open');
        });
    }
}

// ==================== MOBILE MENU (simple toggle for future expansion) ====================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    // For simplicity, we could show a dropdown - but not required. 
    // I'll make it scroll to products.
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ==================== INITIALIZE ON PAGE LOAD ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCart();          // Load cart from storage
    renderProducts();    // Show products
    initFilters();       // Category filter buttons
    initCartSidebar();   // Open/close cart
    initMobileMenu();    // Mobile menu helper
});