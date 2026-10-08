package com.banfico.banking_api.exception;

public class CustomerAccessException extends RuntimeException {
    public CustomerAccessException(String message) {
        super(message);
    }
}
