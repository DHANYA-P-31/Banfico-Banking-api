package com.banfico.banking_api.service;

import com.banfico.banking_api.dto.CustomerRequest;
import com.banfico.banking_api.dto.CustomerResponse;

import java.util.List;
import com.banfico.banking_api.entity.Customer;

public interface CustomerService {

    CustomerResponse createCustomer(CustomerRequest request);

    List<CustomerResponse> getAllCustomers();

    CustomerResponse getCustomerById(Long id);

    CustomerResponse updateCustomer(Long id, CustomerRequest request);

    void deleteCustomer(Long id);

    Customer activateOnlineBanking(Long id, String keycloakUserId);
}