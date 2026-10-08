package com.banfico.banking_api.service;

import com.banfico.banking_api.entity.Customer;
import com.banfico.banking_api.entity.CustomerStatus;
import com.banfico.banking_api.exception.CustomerAccessException;
import com.banfico.banking_api.repository.CustomerRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class CurrentCustomerService {
    private final CustomerRepository customerRepository;

    public CurrentCustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer getCurrentCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            throw new CustomerAccessException("CUSTOMER_PROFILE_NOT_LINKED");
        }

        return customerRepository.findByKeycloakUserId(jwtAuthentication.getToken().getSubject())
                .map(this::requireActive)
                .orElseThrow(() -> new CustomerAccessException("CUSTOMER_PROFILE_NOT_LINKED"));
    }

    private Customer requireActive(Customer customer) {
        if (customer.getStatus() == CustomerStatus.SUSPENDED) {
            throw new CustomerAccessException("CUSTOMER_SUSPENDED");
        }
        if (customer.getStatus() == CustomerStatus.CLOSED) {
            throw new CustomerAccessException("CUSTOMER_CLOSED");
        }
        return customer;
    }
}
