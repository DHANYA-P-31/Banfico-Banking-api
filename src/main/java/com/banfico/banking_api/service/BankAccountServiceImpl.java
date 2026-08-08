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

@Service
public class BankAccountServiceImpl implements BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final CustomerRepository customerRepository;

    public BankAccountServiceImpl(
            BankAccountRepository bankAccountRepository,
            CustomerRepository customerRepository) {

        this.bankAccountRepository = bankAccountRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public BankAccountResponse createAccount(
            BankAccountRequest request) {

        if (bankAccountRepository
                .existsByAccountNumber(request.getAccountNumber())) {

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

        account.setAccountNumber(request.getAccountNumber());
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getBalance());
        account.setCustomer(customer);

        BankAccount savedAccount =
                bankAccountRepository.save(account);

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

        account.setAccountNumber(request.getAccountNumber());
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getBalance());
        account.setCustomer(customer);

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

    private BankAccountResponse mapToResponse(
            BankAccount account) {

        return new BankAccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountType(),
                account.getBalance(),
                account.getCustomer().getId()
        );
    }
}