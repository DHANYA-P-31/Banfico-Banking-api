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
    private final AuditService auditService;

    public ConsentServiceImpl(ConsentRepository consentRepository,
                              CustomerRepository customerRepository,
                              BankAccountRepository accountRepository,
                              AuditService auditService) {
        this.consentRepository = consentRepository;
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
        this.auditService = auditService;
    }

    @Override
    @Transactional
    public ConsentResponse createConsent(ConsentRequest request) {
        Customer customer;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Customer not found with id: " + request.getCustomerId()));
        } else if (request.getCustomerNumber() != null && !request.getCustomerNumber().isBlank()) {
            customer = customerRepository.findByCustomerNumber(request.getCustomerNumber())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Customer not found with customer number: " + request.getCustomerNumber()));
        } else {
            throw new IllegalArgumentException("Customer ID or Customer Number is required");
        }

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
        Consent saved = consentRepository.save(consent);
        auditService.record("CONSENT_CREATED", customer.getId(), "CONSENT", saved.getId());
        return map(saved);
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

    @Override
    @Transactional
    public ConsentResponse revokeConsent(Long id) {
        Consent consent = consentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found with id: " + id));
        if (consent.getStatus() != ConsentStatus.APPROVED) {
            throw new IllegalStateException("Only approved consents can be revoked");
        }
        consent.setStatus(ConsentStatus.REVOKED);
        Consent saved = consentRepository.save(consent);
        auditService.record("CONSENT_REVOKED", consent.getCustomer().getId(), "CONSENT", consent.getId());
        return map(saved);
    }

    private ConsentResponse decide(Long id, ConsentStatus status) {
        Consent consent = consentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Consent not found with id: " + id));
        expireIfNecessary(consent);
        if (consent.getStatus() != ConsentStatus.PENDING) {
            throw new IllegalStateException("Only pending consents can be decided");
        }
        consent.setStatus(status);
        Consent saved = consentRepository.save(consent);
        auditService.record("CONSENT_" + status.name(), consent.getCustomer().getId(), "CONSENT", consent.getId());
        return map(saved);
    }

    private void expireIfNecessary(Consent consent) {
        if (consent.getStatus() == ConsentStatus.PENDING
                && consent.getExpiresAt() != null
                && consent.getExpiresAt().isBefore(LocalDateTime.now())) {
            consent.setStatus(ConsentStatus.EXPIRED);
        }
    }

    private ConsentResponse map(Consent consent) {
        expireIfNecessary(consent);
        String custNum = consent.getCustomer().getCustomerNumber() != null ? consent.getCustomer().getCustomerNumber() : String.valueOf(consent.getCustomer().getId());
        String custName = consent.getCustomer().getName();
        String accNum = consent.getAccount().getAccountNumber() != null ? consent.getAccount().getAccountNumber() : String.valueOf(consent.getAccount().getId());
        return new ConsentResponse(consent.getId(), consent.getCustomer().getId(), custNum, custName,
                consent.getAccount().getId(), accNum, consent.getThirdPartyName(),
                consent.getDataScope(), consent.getStatus(), consent.getCreatedAt(),
                consent.getExpiresAt());
    }

}
