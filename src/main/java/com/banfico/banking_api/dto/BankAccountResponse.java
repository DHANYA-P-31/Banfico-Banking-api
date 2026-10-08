package com.banfico.banking_api.dto;

import java.math.BigDecimal;

public class BankAccountResponse {

    private Long id;
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String customerId;
    private String customerNumber;
    private String status;

    public BankAccountResponse() {
    }

    public BankAccountResponse(
            Long id,
            String accountNumber,
            String accountType,
            BigDecimal balance,
            String customerId) {
        this(id, accountNumber, accountType, balance, customerId, null, null);
    }

    public BankAccountResponse(
            Long id,
            String accountNumber,
            String accountType,
            BigDecimal balance,
            String customerId,
            String status) {
        this(id, accountNumber, accountType, balance, customerId, null, status);
    }

    public BankAccountResponse(
            Long id,
            String accountNumber,
            String accountType,
            BigDecimal balance,
            String customerId,
            String customerNumber,
            String status) {

        this.id = id;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.customerId = customerId;
        this.customerNumber = customerNumber;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerNumber() {
        return customerNumber;
    }

    public void setCustomerNumber(String customerNumber) {
        this.customerNumber = customerNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}