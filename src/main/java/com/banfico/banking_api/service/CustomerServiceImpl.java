package com.banfico.banking_api.service;

import com.banfico.banking_api.dto.CustomerRequest;
import com.banfico.banking_api.dto.CustomerResponse;
import com.banfico.banking_api.entity.Customer;
import com.banfico.banking_api.exception.ResourceNotFoundException;
import com.banfico.banking_api.repository.CustomerRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final AuditService auditService;
    private final KeycloakAdminService keycloakAdminService;

    public CustomerServiceImpl(CustomerRepository customerRepository,
                               AuditService auditService,
                               KeycloakAdminService keycloakAdminService) {
        this.customerRepository = customerRepository;
        this.auditService = auditService;
        this.keycloakAdminService = keycloakAdminService;
    }

    @Override
    public CustomerResponse createCustomer(CustomerRequest request) {

        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        Customer customer = new Customer();

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setStatus(com.banfico.banking_api.entity.CustomerStatus.PENDING_ACTIVATION);

        Customer savedCustomer = customerRepository.save(customer);
        String customerNumber = String.format("CUST%06d", savedCustomer.getId());
        savedCustomer.setCustomerNumber(customerNumber);
        savedCustomer = customerRepository.save(savedCustomer);

        String initialPassword = com.banfico.banking_api.util.InitialPasswordGenerator.generate(
                savedCustomer.getName(),
                savedCustomer.getPhoneNumber()
        );
        String keycloakUserId;

        try {
            keycloakUserId = keycloakAdminService.createCustomerUser(
                    customerNumber,
                    savedCustomer.getEmail(),
                    savedCustomer.getName(),
                    initialPassword
            );
        } catch (Exception e) {
            customerRepository.delete(savedCustomer);
            throw new RuntimeException("Failed to create Keycloak user: " + e.getMessage(), e);
        }

        savedCustomer.setKeycloakUserId(keycloakUserId);
        savedCustomer.setStatus(com.banfico.banking_api.entity.CustomerStatus.ACTIVE);

        try {
            Customer finalCustomer = customerRepository.save(savedCustomer);
            auditService.record("CUSTOMER_CREATED", finalCustomer.getId(), "CUSTOMER", finalCustomer.getId());

            return mapToResponse(finalCustomer);
        } catch (Exception e) {
            try {
                keycloakAdminService.deleteUser(keycloakUserId);
            } catch (Exception ex) {
                // ignore compensation exception
            }
            customerRepository.delete(savedCustomer);
            throw new RuntimeException("Failed to finalize customer activation: " + e.getMessage(), e);
        }
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {

        return customerRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + id
                        ));

        return mapToResponse(customer);
    }

    @Override
    public CustomerResponse updateCustomer(
            Long id,
            CustomerRequest request) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + id
                        ));

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setKeycloakUserId(request.getKeycloakUserId());
        if (request.getStatus() != null) {
            customer.setStatus(com.banfico.banking_api.entity.CustomerStatus.valueOf(request.getStatus()));
        }

        Customer updatedCustomer = customerRepository.save(customer);

        return mapToResponse(updatedCustomer);
    }

    @Override
    public void deleteCustomer(Long id) {

        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Customer not found with id: " + id
            );
        }

        customerRepository.deleteById(id);
    }

    @Override
    public Customer activateOnlineBanking(Long id, String keycloakUserId) {
        if (customerRepository.existsByKeycloakUserId(keycloakUserId)) {
            throw new IllegalArgumentException("Keycloak user is already linked");
        }
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customer.setKeycloakUserId(keycloakUserId);
        customer.setStatus(com.banfico.banking_api.entity.CustomerStatus.ACTIVE);
        Customer saved = customerRepository.save(customer);
        auditService.record("CUSTOMER_ACTIVATED", saved.getId(), "CUSTOMER", saved.getId());
        return saved;
    }

    private CustomerResponse mapToResponse(Customer customer) {

        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getAddress(),
                customer.getCustomerNumber(),
                customer.getStatus() == null ? null : customer.getStatus().name()
        );
    }
}