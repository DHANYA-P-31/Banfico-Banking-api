package com.banfico.banking_api.service;

import com.banfico.banking_api.dto.BankAccountRequest;
import com.banfico.banking_api.dto.BankAccountResponse;
import com.banfico.banking_api.entity.BankAccount;
import com.banfico.banking_api.entity.Customer;
import com.banfico.banking_api.exception.ResourceNotFoundException;
import com.banfico.banking_api.repository.BankAccountRepository;
import com.banfico.banking_api.repository.CustomerRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.math.BigDecimal;
import java.util.UUID;

@Service
public class BankAccountServiceImpl implements BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final CustomerRepository customerRepository;
    private final AuditService auditService;

    public BankAccountServiceImpl(
            BankAccountRepository bankAccountRepository,
            CustomerRepository customerRepository,
            AuditService auditService) {

        this.bankAccountRepository = bankAccountRepository;
        this.customerRepository = customerRepository;
        this.auditService = auditService;
    }

    @Override
    public BankAccountResponse createAccount(
            BankAccountRequest request) {

        if (request.getAccountNumber() != null
                && !request.getAccountNumber().isBlank()
                && bankAccountRepository.existsByAccountNumber(request.getAccountNumber())) {

            throw new IllegalArgumentException(
                    "Account number already exists");
        }

        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: "
                                        + request.getCustomerId()));

        BankAccount account = new BankAccount();

        account.setAccountNumber(request.getAccountNumber() == null || request.getAccountNumber().isBlank()
                ? "PENDING-" + UUID.randomUUID()
                : request.getAccountNumber());
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getBalance() == null ? BigDecimal.ZERO : request.getBalance());
        account.setCustomer(customer);

        BankAccount savedAccount =
                bankAccountRepository.save(account);
        if (request.getAccountNumber() == null || request.getAccountNumber().isBlank()) {
            savedAccount.setAccountNumber(String.format("100%09d", savedAccount.getId()));
            savedAccount = bankAccountRepository.save(savedAccount);
        }
        auditService.record("ACCOUNT_CREATED", customer.getId(), "ACCOUNT", savedAccount.getId());

        return mapToResponse(savedAccount);
    }

    @Override
    public List<BankAccountResponse> getAllAccounts() {

        return bankAccountRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BankAccountResponse getAccountById(Long id) {

        BankAccount account = bankAccountRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found with id: " + id));

        return mapToResponse(account);
    }

    @Override
    public BankAccountResponse updateAccount(
            Long id,
            BankAccountRequest request) {

        BankAccount account = bankAccountRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found with id: " + id));

        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: "
                                        + request.getCustomerId()));

        account.setAccountType(request.getAccountType());

        BankAccount updatedAccount =
                bankAccountRepository.save(account);

        return mapToResponse(updatedAccount);
    }

    @Override
    public void deleteAccount(Long id) {

        if (!bankAccountRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Account not found with id: " + id);
        }

        bankAccountRepository.deleteById(id);
    }

    @Override
    public BankAccountResponse closeAccount(Long id) {
        BankAccount account = bankAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        if (account.getStatus() == com.banfico.banking_api.entity.AccountStatus.CLOSED) {
            throw new IllegalStateException("Account is already closed");
        }
        account.setStatus(com.banfico.banking_api.entity.AccountStatus.CLOSED);
        BankAccount closed = bankAccountRepository.save(account);
        auditService.record("ACCOUNT_CLOSED", closed.getCustomer().getId(), "ACCOUNT", closed.getId());
        return mapToResponse(closed);
    }

    private BankAccountResponse mapToResponse(
            BankAccount account) {

        String custIdStr = account.getCustomer() != null && account.getCustomer().getId() != null
                ? String.valueOf(account.getCustomer().getId())
                : null;
        String custNum = account.getCustomer() != null
                ? account.getCustomer().getCustomerNumber()
                : null;

        return new BankAccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountType(),
                account.getBalance(),
                custIdStr,
                custNum,
                account.getStatus() == null ? null : account.getStatus().name()
        );
    }
}