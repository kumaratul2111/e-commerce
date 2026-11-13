const AUTH_SERVICE_URL = "";

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            message.textContent = "Registration failed.";
            return;
        }

        alert("Registration successful. Please login.");
        window.location.href = "/login.html";
    } catch (error) {
        console.error(error);
        message.textContent = "Unable to connect to the authentication service.";
    }
});
