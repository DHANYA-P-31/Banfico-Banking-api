package com.banfico.banking_api.controller;

import com.banfico.banking_api.dto.BankAccountRequest;
import com.banfico.banking_api.dto.BankAccountResponse;
import com.banfico.banking_api.service.BankAccountService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class BankAccountController {

    private final BankAccountService bankAccountService;

    public BankAccountController(
            BankAccountService bankAccountService) {

        this.bankAccountService = bankAccountService;
    }

    @PostMapping
    public ResponseEntity<BankAccountResponse> createAccount(
            @Valid @RequestBody BankAccountRequest request) {

        BankAccountResponse response =
                bankAccountService.createAccount(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<BankAccountResponse>>
    getAllAccounts() {

        return ResponseEntity.ok(
                bankAccountService.getAllAccounts()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankAccountResponse>
    getAccountById(@PathVariable Long id) {

        return ResponseEntity.ok(
                bankAccountService.getAccountById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankAccountResponse>
    updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody BankAccountRequest request) {

        return ResponseEntity.ok(
                bankAccountService.updateAccount(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteAccount(@PathVariable Long id) {

        bankAccountService.deleteAccount(id);

        return ResponseEntity.noContent().build();
    }
}