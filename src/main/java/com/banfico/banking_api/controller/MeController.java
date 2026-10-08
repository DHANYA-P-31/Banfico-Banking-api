package com.banfico.banking_api.controller;

import com.banfico.banking_api.dto.*;
import com.banfico.banking_api.entity.*;
import com.banfico.banking_api.exception.ResourceNotFoundException;
import com.banfico.banking_api.repository.*;
import com.banfico.banking_api.service.CurrentCustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/me")
public class MeController {
    private final CurrentCustomerService currentCustomerService;
    private final BankAccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final ConsentRepository consentRepository;
    private final CustomerRepository customerRepository;
    private final com.banfico.banking_api.service.AuditService auditService;

    public MeController(CurrentCustomerService currentCustomerService,
                        BankAccountRepository accountRepository,
                        TransactionRepository transactionRepository,
                        BeneficiaryRepository beneficiaryRepository,
                        ConsentRepository consentRepository,
                        CustomerRepository customerRepository,
                        com.banfico.banking_api.service.AuditService auditService) {
        this.currentCustomerService = currentCustomerService;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.consentRepository = consentRepository;
        this.customerRepository = customerRepository;
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<CustomerResponse> profile() {
        return ResponseEntity.ok(mapCustomer(currentCustomerService.getCurrentCustomer()));
    }

    @GetMapping("/profile")
    public ResponseEntity<CustomerResponse> profileAlias() {
        return profile();
    }

    @PutMapping("/profile")
    public ResponseEntity<CustomerResponse> updateProfile(@Valid @RequestBody CustomerRequest request) {
        Customer customer = currentCustomerService.getCurrentCustomer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        Customer saved = customerRepository.save(customer);
        auditService.record("PROFILE_UPDATED", saved.getId(), "CUSTOMER", saved.getId());
        return ResponseEntity.ok(mapCustomer(saved));
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<BankAccountResponse>> accounts() {
        Long customerId = currentCustomerService.getCurrentCustomer().getId();
        return ResponseEntity.ok(accountRepository.findByCustomerId(customerId)
                .stream().map(this::mapAccount).toList());
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<BankAccountResponse> account(@PathVariable Long id) {
        Long customerId = currentCustomerService.getCurrentCustomer().getId();
        return ResponseEntity.ok(mapAccount(accountRepository.findByIdAndCustomerId(id, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"))));
    }

    @GetMapping("/accounts/{id}/transactions")
    public ResponseEntity<List<TransactionResponse>> transactions(@PathVariable Long id) {
        Long customerId = currentCustomerService.getCurrentCustomer().getId();
        accountRepository.findByIdAndCustomerId(id, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        return ResponseEntity.ok(transactionRepository.findByAccountIdAndAccountCustomerId(id, customerId)
                .stream().map(this::mapTransaction).toList());
    }

    @GetMapping("/beneficiaries")
    public ResponseEntity<List<BeneficiaryResponse>> beneficiaries() {
        Long customerId = currentCustomerService.getCurrentCustomer().getId();
        return ResponseEntity.ok(beneficiaryRepository.findByCustomerId(customerId)
                .stream().map(this::mapBeneficiary).toList());
    }

    @PostMapping("/beneficiaries")
    public ResponseEntity<BeneficiaryResponse> createBeneficiary(@Valid @RequestBody BeneficiaryRequest request) {
        Customer customer = currentCustomerService.getCurrentCustomer();
        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setName(request.getName());
        beneficiary.setAccountNumber(request.getAccountNumber());
        beneficiary.setBankName(request.getBankName());
        beneficiary.setIfscCode(request.getIfscCode());
        beneficiary.setCustomer(customer);
        Beneficiary saved = beneficiaryRepository.save(beneficiary);
        auditService.record("BENEFICIARY_CREATED", customer.getId(), "BENEFICIARY", saved.getId());
        return ResponseEntity.ok(mapBeneficiary(saved));
    }

    @DeleteMapping("/beneficiaries/{id}")
    public ResponseEntity<Void> deleteBeneficiary(@PathVariable Long id) {
        Long customerId = currentCustomerService.getCurrentCustomer().getId();
        Beneficiary beneficiary = beneficiaryRepository.findByIdAndCustomerId(id, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found"));
        beneficiaryRepository.delete(beneficiary);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/consents")
    public ResponseEntity<List<ConsentResponse>> consents() {
        Long customerId = currentCustomerService.getCurrentCustomer().getId();
        return ResponseEntity.ok(consentRepository.findByCustomerId(customerId)
                .stream().map(this::mapConsent).toList());
    }

    @PutMapping("/consents/{id}/approve")
    public ResponseEntity<ConsentResponse> approve(@PathVariable Long id) {
        return decide(id, ConsentStatus.APPROVED);
    }

    @PutMapping("/consents/{id}/reject")
    public ResponseEntity<ConsentResponse> reject(@PathVariable Long id) {
        return decide(id, ConsentStatus.REJECTED);
    }

    @PutMapping("/consents/{id}/revoke")
    public ResponseEntity<ConsentResponse> revoke(@PathVariable Long id) {
        Long customerId = currentCustomerService.getCurrentCustomer().getId();
        Consent consent = consentRepository.findByIdAndCustomerId(id, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found"));
        if (consent.getStatus() != ConsentStatus.APPROVED) {
            throw new IllegalStateException("Only approved consents can be revoked");
        }
        consent.setStatus(ConsentStatus.REVOKED);
        Consent saved = consentRepository.save(consent);
        auditService.record("CONSENT_REVOKED", customerId, "CONSENT", saved.getId());
        return ResponseEntity.ok(mapConsent(saved));
    }

    private ResponseEntity<ConsentResponse> decide(Long id, ConsentStatus status) {
        Long customerId = currentCustomerService.getCurrentCustomer().getId();
        Consent consent = consentRepository.findByIdAndCustomerId(id, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found"));
        if (consent.getStatus() != ConsentStatus.PENDING) {
            throw new IllegalStateException("Only pending consents can be decided");
        }
        consent.setStatus(status);
        return ResponseEntity.ok(mapConsent(consentRepository.save(consent)));
    }

    private CustomerResponse mapCustomer(Customer customer) {
        return new CustomerResponse(customer.getId(), customer.getName(), customer.getEmail(),
                customer.getPhoneNumber(), customer.getAddress(), customer.getCustomerNumber(),
                customer.getStatus() == null ? null : customer.getStatus().name());
    }

    private BankAccountResponse mapAccount(BankAccount account) {
        String custIdStr = account.getCustomer() != null && account.getCustomer().getId() != null
                ? String.valueOf(account.getCustomer().getId())
                : null;
        String custNum = account.getCustomer() != null
                ? account.getCustomer().getCustomerNumber()
                : null;
        return new BankAccountResponse(account.getId(), account.getAccountNumber(), account.getAccountType(),
                account.getBalance(), custIdStr, custNum,
                account.getStatus() == null ? null : account.getStatus().name());
    }

    private TransactionResponse mapTransaction(Transaction transaction) {
        return new TransactionResponse(transaction.getId(), transaction.getType(), transaction.getAmount(),
                transaction.getTransactionDate(), transaction.getAccount().getId(), transaction.getAccount().getAccountNumber());
    }

    private BeneficiaryResponse mapBeneficiary(Beneficiary beneficiary) {
        return new BeneficiaryResponse(beneficiary.getId(), beneficiary.getName(), beneficiary.getAccountNumber(),
                beneficiary.getBankName(), beneficiary.getIfscCode(), beneficiary.getCustomer().getId(), beneficiary.getCustomer().getCustomerNumber());
    }

    private ConsentResponse mapConsent(Consent consent) {
        return new ConsentResponse(consent.getId(), consent.getCustomer().getId(), consent.getAccount().getId(),
                consent.getThirdPartyName(), consent.getDataScope(), consent.getStatus(),
                consent.getCreatedAt(), consent.getExpiresAt());
    }
}
