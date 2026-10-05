package com.banfico.banking_api.service;

import com.banfico.banking_api.dto.ConsentRequest;
import com.banfico.banking_api.dto.ConsentResponse;

import java.util.List;

public interface ConsentService {
    ConsentResponse createConsent(ConsentRequest request);
    List<ConsentResponse> getAllConsents();
    ConsentResponse getConsentById(Long id);
    ConsentResponse approveConsent(Long id);
    ConsentResponse rejectConsent(Long id);
}
