package com.banfico.banking_api.service;

import com.banfico.banking_api.dto.TransactionRequest;
import com.banfico.banking_api.dto.TransactionResponse;
import com.banfico.banking_api.entity.BankAccount;
import com.banfico.banking_api.entity.Transaction;
import com.banfico.banking_api.entity.TransactionType;
import com.banfico.banking_api.exception.ResourceNotFoundException;
import com.banfico.banking_api.repository.BankAccountRepository;
import com.banfico.banking_api.repository.TransactionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionServiceImpl
        implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final BankAccountRepository bankAccountRepository;

    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            BankAccountRepository bankAccountRepository) {

        this.transactionRepository = transactionRepository;
        this.bankAccountRepository = bankAccountRepository;
    }

    @Override
    @Transactional
    public TransactionResponse createTransaction(
            Long accountId,
            TransactionRequest request) {

        BankAccount account = bankAccountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found with id: "
                                        + accountId));

        BigDecimal currentBalance = account.getBalance();
        BigDecimal amount = request.getAmount();

        if (request.getType() == TransactionType.DEPOSIT) {

            account.setBalance(
                    currentBalance.add(amount)
            );

        } else if (request.getType()
                == TransactionType.WITHDRAWAL) {

            if (currentBalance.compareTo(amount) < 0) {

                throw new IllegalArgumentException(
                        "Insufficient balance"
                );
            }

            account.setBalance(
                    currentBalance.subtract(amount)
            );
        }

        Transaction transaction = new Transaction();

        transaction.setType(request.getType());
        transaction.setAmount(amount);
        transaction.setTransactionDate(
                LocalDateTime.now()
        );
        transaction.setAccount(account);

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        // Save the updated account balance
        bankAccountRepository.save(account);

        return mapToResponse(savedTransaction);
    }

    @Override
    public List<TransactionResponse>
    getTransactionsByAccount(Long accountId) {

        // First verify that account exists
        if (!bankAccountRepository.existsById(accountId)) {

            throw new ResourceNotFoundException(
                    "Account not found with id: "
                            + accountId);
        }

        return transactionRepository
                .findByAccountId(accountId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private TransactionResponse mapToResponse(
            Transaction transaction) {

        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getTransactionDate(),
                transaction.getAccount().getId()
        );
    }
}