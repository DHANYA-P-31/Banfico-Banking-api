package com.banfico.banking_api.dto;

import jakarta.validation.constraints.NotBlank;

public class OnlineBankingActivationRequest {
    @NotBlank(message = "Keycloak user ID is required")
    private String keycloakUserId;

    public String getKeycloakUserId() {
        return keycloakUserId;
    }

    public void setKeycloakUserId(String keycloakUserId) {
        this.keycloakUserId = keycloakUserId;
    }
}
