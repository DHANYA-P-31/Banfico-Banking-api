package com.banfico.banking_api.service;

import com.banfico.banking_api.dto.BeneficiaryRequest;
import com.banfico.banking_api.dto.BeneficiaryResponse;

import java.util.List;

public interface BeneficiaryService {

    BeneficiaryResponse createBeneficiary(
            BeneficiaryRequest request);

    List<BeneficiaryResponse> getAllBeneficiaries();

    void deleteBeneficiary(Long id);
}