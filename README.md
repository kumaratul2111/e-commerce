# E-Commerce Frontend - Spring Boot

This project replaces the Node.js frontend server with a Spring Boot server.

## Architecture

Browser
    |
    | HTTP
    v
Spring Boot Frontend :5500
    |
    | JavaScript fetch()
    +-----------------------> Auth Service :8080
    |                           |
    |                           +--> returns JWT
    |
    +-----------------------> Product Service :8081
                                |
                                +--> validates JWT

The Spring Boot frontend server only serves the static HTML/CSS/JS files.
The browser makes the API calls directly to the Auth and Product services.

## Requirements

- Java 21
- Maven 3.9+
- Auth Service running on port 8080
- Product Service running on port 8081

## Run

From this directory:

    mvn spring-boot:run

Then open:

    http://localhost:5500/

The root URL redirects to:

    http://localhost:5500/login.html

You can also build a JAR:

    mvn clean package

Then run:

    java -jar target/ecommerce-frontend-0.0.1-SNAPSHOT.jar

## Expected Auth Service APIs

Login:

    POST http://localhost:8080/auth/login

Request JSON:

    {
      "email": "user@example.com",
      "password": "password"
    }

Expected successful response:

    {
      "token": "JWT_TOKEN"
    }

Registration:

    POST http://localhost:8080/register

Request JSON:

    {
      "firstName": "Atul",
      "lastName": "Kumar",
      "email": "user@example.com",
      "password": "password"
    }

## Product Service API

The frontend calls:

    GET http://localhost:8081/products

with:

    Authorization: Bearer <JWT>

## Important: CORS

Because the browser is loaded from:

    http://localhost:5500

while the backend services run on:

    http://localhost:8080
    http://localhost:8081

the Auth Service and Product Service must allow CORS from:

    http://localhost:5500

The Spring Boot frontend server does NOT act as a reverse proxy.

## Existing Thymeleaf Auth Service

If your Auth Service currently uses:

    @ModelAttribute

for the login/registration forms, change the API endpoints used by this frontend to accept JSON with:

    @RequestBody

For example, the login endpoint should accept:

    @RequestBody User user

and return the JWT as JSON.

This is because the new frontend is a separate client application rather than a Thymeleaf application rendered by the Auth Service.
