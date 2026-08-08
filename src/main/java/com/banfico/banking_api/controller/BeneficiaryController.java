package com.banfico.banking_api.controller;

import com.banfico.banking_api.dto.BeneficiaryRequest;
import com.banfico.banking_api.dto.BeneficiaryResponse;
import com.banfico.banking_api.service.BeneficiaryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    public BeneficiaryController(
            BeneficiaryService beneficiaryService) {

        this.beneficiaryService = beneficiaryService;
    }

    @PostMapping
    public ResponseEntity<BeneficiaryResponse>
    createBeneficiary(
            @Valid @RequestBody BeneficiaryRequest request) {

        BeneficiaryResponse response =
                beneficiaryService.createBeneficiary(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<BeneficiaryResponse>>
    getAllBeneficiaries() {

        return ResponseEntity.ok(
                beneficiaryService.getAllBeneficiaries()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteBeneficiary(@PathVariable Long id) {

        beneficiaryService.deleteBeneficiary(id);

        return ResponseEntity.noContent().build();
    }
}