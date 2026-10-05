package com.banfico.banking_api.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class ConsentRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    @NotNull(message = "Account ID is required")
    private Long accountId;
    @NotBlank(message = "Third-party name is required")
    private String thirdPartyName;
    @NotBlank(message = "Data scope is required")
    private String dataScope;
    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDateTime expiresAt;

    public ConsentRequest() {}
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
    public String getThirdPartyName() { return thirdPartyName; }
    public void setThirdPartyName(String thirdPartyName) { this.thirdPartyName = thirdPartyName; }
    public String getDataScope() { return dataScope; }
    public void setDataScope(String dataScope) { this.dataScope = dataScope; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
