const PRODUCT_SERVICE_URL = "http://localhost";

const token = sessionStorage.getItem("jwt");
const productsContainer = document.getElementById("products");
const message = document.getElementById("message");
const logoutButton = document.getElementById("logoutButton");

if (!token) {
    window.location.href = "/login.html";
}

logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("jwt");
    window.location.href = "/login.html";
});

async function loadProducts() {
    try {
        const response = await fetch(`${PRODUCT_SERVICE_URL}/api/products`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("jwt");
            window.location.href = "/login.html";
            return;
        }

        if (!response.ok) {
            message.textContent = "Unable to load products.";
            return;
        }

        const products = await response.json();

        productsContainer.innerHTML = "";

        products.forEach(product => {
            const div = document.createElement("div");
            div.className = "product";

            div.innerHTML = `
                <h3>${product.name ?? "Product"}</h3>
                <p>ID: ${product.id ?? ""}</p>
                <p>Price: ${product.price ?? ""}</p>
            `;

            productsContainer.appendChild(div);
        });
    } catch (error) {
        console.error(error);
        message.textContent = "Unable to connect to the product service.";
    }
}

loadProducts();
