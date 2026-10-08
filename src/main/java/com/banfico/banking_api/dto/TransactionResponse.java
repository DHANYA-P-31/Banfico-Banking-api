package com.banfico.banking_api.dto;

import com.banfico.banking_api.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private TransactionType type;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
    private Long accountId;
    private String accountNumber;

    public TransactionResponse() {
    }

    public TransactionResponse(
            Long id,
            TransactionType type,
            BigDecimal amount,
            LocalDateTime transactionDate,
            Long accountId) {
        this(id, type, amount, transactionDate, accountId, null);
    }

    public TransactionResponse(
            Long id,
            TransactionType type,
            BigDecimal amount,
            LocalDateTime transactionDate,
            Long accountId,
            String accountNumber) {

        this.id = id;
        this.type = type;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.accountId = accountId;
        this.accountNumber = accountNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }
}