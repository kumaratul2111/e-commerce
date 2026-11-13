// Nginx serves this frontend and proxies /api/* requests to the backend services.
// Change these paths if your Nginx location blocks or Spring Boot endpoints differ.
const PRODUCT_API = "/api/products";
const ORDER_API = "/api/orders";

const token = sessionStorage.getItem("jwt");
const productsContainer = document.getElementById("products");
const message = document.getElementById("message");
const logoutButton = document.getElementById("logoutButton");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");
const placeOrderButton = document.getElementById("placeOrderButton");
const cartCountElement = document.getElementById("cartCount");

let productsById = new Map();
let cart = new Map(); // productId -> quantity

if (!token) {
    window.location.href = "/login.html";
}

logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("jwt");
    window.location.href = "/login.html";
});

function authHeaders(json = false) {
    const headers = { "Authorization": `Bearer ${token}` };
    if (json) headers["Content-Type"] = "application/json";
    return headers;
}

function showMessage(text, isError = false) {
    message.textContent = text;
    message.className = isError ? "message error" : "message success";
}

function formatPrice(price) {
    const amount = Number(price);
    return Number.isFinite(amount) ? amount.toFixed(2) : String(price ?? "N/A");
}

function addToCart(productId) {
    const current = cart.get(String(productId)) || 0;
    cart.set(String(productId), current + 1);
    renderCart();
    showMessage("Product added to your cart.");
}

function updateQuantity(productId, quantity) {
    const parsed = Number.parseInt(quantity, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        cart.delete(String(productId));
    } else {
        cart.set(String(productId), parsed);
    }
    renderCart();
}

function removeFromCart(productId) {
    cart.delete(String(productId));
    renderCart();
}

function renderCart() {
    cartItemsContainer.replaceChildren();
    let total = 0;
    let count = 0;

    for (const [productId, quantity] of cart.entries()) {
        const product = productsById.get(productId);
        if (!product) continue;

        const price = Number(product.price) || 0;
        total += price * quantity;
        count += quantity;

        const row = document.createElement("div");
        row.className = "cart-row";

        const details = document.createElement("div");
        details.className = "cart-product";
        const name = document.createElement("strong");
        name.textContent = product.name || "Product";
        const unitPrice = document.createElement("span");
        unitPrice.textContent = `₹${formatPrice(product.price)} each`;
        details.append(name, unitPrice);

        const controls = document.createElement("div");
        controls.className = "cart-controls";
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.max = "99";
        quantityInput.value = String(quantity);
        quantityInput.setAttribute("aria-label", `Quantity for ${product.name || "product"}`);
        quantityInput.addEventListener("change", () => {
            const value = Math.min(99, Math.max(0, Number.parseInt(quantityInput.value, 10) || 0));
            updateQuantity(productId, value);
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => removeFromCart(productId));

        controls.append(quantityInput, removeButton);
        row.append(details, controls);
        cartItemsContainer.appendChild(row);
    }

    if (cart.size === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-cart";
        empty.textContent = "Your cart is empty. Add products to get started.";
        cartItemsContainer.appendChild(empty);
    }

    cartTotalElement.textContent = `₹${total.toFixed(2)}`;
    cartCountElement.textContent = String(count);
    placeOrderButton.disabled = cart.size === 0;
}

function renderProducts(products) {
    productsContainer.replaceChildren();
    productsById = new Map(products.map(product => [String(product.id), product]));

    products.forEach(product => {
        const card = document.createElement("article");
        card.className = "product";

        const name = document.createElement("h3");
        name.textContent = product.name || "Product";

        const id = document.createElement("p");
        id.className = "product-id";
        id.textContent = `ID: ${product.id ?? ""}`;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = `₹${formatPrice(product.price)}`;

        // Let the customer choose the quantity before adding this product.
        const purchaseControls = document.createElement("div");
        purchaseControls.className = "purchase-controls";

        const quantityLabel = document.createElement("label");
        quantityLabel.textContent = "Quantity";
        quantityLabel.setAttribute("for", `quantity-${product.id}`);

        const quantityInput = document.createElement("input");
        quantityInput.id = `quantity-${product.id}`;
        quantityInput.className = "product-quantity";
        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.max = "99";
        quantityInput.step = "1";
        quantityInput.value = "1";
        quantityInput.inputMode = "numeric";
        quantityInput.setAttribute("aria-label", `Quantity to add for ${product.name || "product"}`);

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "add-to-cart-button";
        addButton.textContent = "Add to cart";
        addButton.addEventListener("click", () => {
            const quantity = Number.parseInt(quantityInput.value, 10);
            if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
                showMessage("Please enter a quantity between 1 and 99.", true);
                quantityInput.focus();
                return;
            }
            // const current = cart.get(String(product.id)) || 0;
            cart.set(String(product.id), quantity);
            renderCart();
            showMessage(`${quantity} × ${product.name || "Product"} added to your cart.`);
            quantityInput.value = "1";
        });

        purchaseControls.append(quantityLabel, quantityInput, addButton);
        card.append(name, id, price, purchaseControls);
        productsContainer.appendChild(card);
    });
}

async function loadProducts() {
    try {
        const response = await fetch(PRODUCT_API, {
            method: "GET",
            headers: authHeaders()
        });

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("jwt");
            window.location.href = "/login.html";
            return;
        }

        if (!response.ok) {
            showMessage(`Unable to load products (HTTP ${response.status}).`, true);
            return;
        }

        const products = await response.json();
        if (!Array.isArray(products)) {
            showMessage("The products API did not return a list.", true);
            return;
        }
        renderProducts(products);
        renderCart();
    } catch (error) {
        console.error("Loading products failed:", error);
        showMessage("Unable to connect to the product service.", true);
    }
}

async function placeOrder() {
    if (cart.size === 0) return;

    const items = Array.from(cart.entries()).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity
    }));

    placeOrderButton.disabled = true;
    placeOrderButton.textContent = "Placing order...";

    try {
        const response = await fetch(ORDER_API, {
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify({ items })
        });

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("jwt");
            window.location.href = "/login.html";
            return;
        }

        if (!response.ok) {
            const detail = await response.text();
            showMessage(`Order failed (HTTP ${response.status}). ${detail}`, true);
            return;
        }

        let result = null;
        const responseText = await response.text();
        if (responseText) {
            try { result = JSON.parse(responseText); } catch { result = null; }
        }

        cart.clear();
        renderCart();
        const orderId = result?.id ?? result?.orderId;
        showMessage(orderId ? `Order placed successfully! Order ID: ${orderId}` : "Order placed successfully!");
    } catch (error) {
        console.error("Placing order failed:", error);
        showMessage("Unable to connect to the order service.", true);
    } finally {
        placeOrderButton.textContent = "Place order";
        placeOrderButton.disabled = cart.size === 0;
    }
}

placeOrderButton.addEventListener("click", placeOrder);
loadProducts();
