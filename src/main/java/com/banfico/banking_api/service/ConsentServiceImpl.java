package com.banfico.banking_api.service;

import com.banfico.banking_api.dto.ConsentRequest;
import com.banfico.banking_api.dto.ConsentResponse;
import com.banfico.banking_api.entity.*;
import com.banfico.banking_api.exception.ResourceNotFoundException;
import com.banfico.banking_api.repository.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsentServiceImpl implements ConsentService {
    private final ConsentRepository consentRepository;
    private final CustomerRepository customerRepository;
    private final BankAccountRepository accountRepository;

    public ConsentServiceImpl(ConsentRepository consentRepository,
                              CustomerRepository customerRepository,
                              BankAccountRepository accountRepository) {
        this.consentRepository = consentRepository;
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    @Transactional
    public ConsentResponse createConsent(ConsentRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found with id: " + request.getCustomerId()));
        BankAccount account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found with id: " + request.getAccountId()));
        if (!account.getCustomer().getId().equals(customer.getId())) {
            throw new IllegalArgumentException("Account does not belong to the customer");
        }

        Consent consent = new Consent();
        consent.setCustomer(customer);
        consent.setAccount(account);
        consent.setThirdPartyName(request.getThirdPartyName());
        consent.setDataScope(request.getDataScope());
        consent.setStatus(ConsentStatus.PENDING);
        consent.setCreatedAt(LocalDateTime.now());
        consent.setExpiresAt(request.getExpiresAt());
        return map(consentRepository.save(consent));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConsentResponse> getAllConsents() {
        return consentRepository.findAll().stream().map(this::map).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ConsentResponse getConsentById(Long id) {
        Consent consent = consentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Consent not found with id: " + id));
        return map(consent);
    }

    @Override
    @Transactional
    public ConsentResponse approveConsent(Long id) {
        return decide(id, ConsentStatus.APPROVED);
    }

    @Override
    @Transactional
    public ConsentResponse rejectConsent(Long id) {
        return decide(id, ConsentStatus.REJECTED);
    }

    private ConsentResponse decide(Long id, ConsentStatus status) {
        Consent consent = consentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Consent not found with id: " + id));
        if (consent.getStatus() != ConsentStatus.PENDING) {
            throw new IllegalStateException("Only pending consents can be decided");
        }
        consent.setStatus(status);
        return map(consentRepository.save(consent));
    }

    private ConsentResponse map(Consent consent) {
        return new ConsentResponse(consent.getId(), consent.getCustomer().getId(),
                consent.getAccount().getId(), consent.getThirdPartyName(),
                consent.getDataScope(), consent.getStatus(), consent.getCreatedAt(),
                consent.getExpiresAt());
    }
}
