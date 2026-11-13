const AUTH_SERVICE_URL = "";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            message.textContent = "Invalid email or password.";
            return;
        }

        const data = await response.json();

        sessionStorage.setItem("jwt", data.token);

        window.location.href = "/products.html";
    } catch (error) {
        console.error(error);
        message.textContent = "Unable to connect to the authentication service.";
    }
});
