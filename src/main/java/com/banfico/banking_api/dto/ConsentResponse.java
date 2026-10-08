package com.banfico.banking_api.dto;

import com.banfico.banking_api.entity.ConsentStatus;

import java.time.LocalDateTime;

public class ConsentResponse {
    private Long id;
    private Long customerId;
    private String customerNumber;
    private String customerName;
    private Long accountId;
    private String accountNumber;
    private String thirdPartyName;
    private String dataScope;
    private ConsentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    public ConsentResponse() {}

    public ConsentResponse(Long id, Long customerId, String customerNumber, String customerName,
                           Long accountId, String accountNumber,
                           String thirdPartyName, String dataScope,
                           ConsentStatus status, LocalDateTime createdAt,
                           LocalDateTime expiresAt) {
        this.id = id;
        this.customerId = customerId;
        this.customerNumber = customerNumber;
        this.customerName = customerName;
        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.thirdPartyName = thirdPartyName;
        this.dataScope = dataScope;
        this.status = status;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public ConsentResponse(Long id, Long customerId, Long accountId,
                           String thirdPartyName, String dataScope,
                           ConsentStatus status, LocalDateTime createdAt,
                           LocalDateTime expiresAt) {
        this(id, customerId, customerId != null ? String.valueOf(customerId) : null, null,
             accountId, accountId != null ? String.valueOf(accountId) : null,
             thirdPartyName, dataScope, status, createdAt, expiresAt);
    }

    public Long getId() { return id; }
    public Long getCustomerId() { return customerId; }
    public String getCustomerNumber() { return customerNumber; }
    public String getCustomerName() { return customerName; }
    public Long getAccountId() { return accountId; }
    public String getAccountNumber() { return accountNumber; }
    public String getThirdPartyName() { return thirdPartyName; }
    public String getDataScope() { return dataScope; }
    public ConsentStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
}

