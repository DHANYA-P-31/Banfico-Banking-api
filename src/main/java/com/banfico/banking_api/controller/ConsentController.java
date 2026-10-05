package com.banfico.banking_api.controller;

import com.banfico.banking_api.dto.ConsentRequest;
import com.banfico.banking_api.dto.ConsentResponse;
import com.banfico.banking_api.service.ConsentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consents")
public class ConsentController {
    private final ConsentService consentService;

    public ConsentController(ConsentService consentService) {
        this.consentService = consentService;
    }

    @PostMapping
    public ResponseEntity<ConsentResponse> create(@Valid @RequestBody ConsentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(consentService.createConsent(request));
    }

    @GetMapping
    public ResponseEntity<List<ConsentResponse>> getAll() {
        return ResponseEntity.ok(consentService.getAllConsents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(consentService.getConsentById(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ConsentResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(consentService.approveConsent(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ConsentResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(consentService.rejectConsent(id));
    }
}
