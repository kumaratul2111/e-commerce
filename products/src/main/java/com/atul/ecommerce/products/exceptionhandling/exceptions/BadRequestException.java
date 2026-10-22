package com.atul.ecommerce.products.exceptionhandling.exceptions;

public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }

}
