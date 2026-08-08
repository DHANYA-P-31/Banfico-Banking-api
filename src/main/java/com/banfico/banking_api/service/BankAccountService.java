package com.banfico.banking_api.service;

import com.banfico.banking_api.dto.BankAccountRequest;
import com.banfico.banking_api.dto.BankAccountResponse;

import java.util.List;

public interface BankAccountService {

    BankAccountResponse createAccount(BankAccountRequest request);

    List<BankAccountResponse> getAllAccounts();

    BankAccountResponse getAccountById(Long id);

    BankAccountResponse updateAccount(
            Long id,
            BankAccountRequest request);

    void deleteAccount(Long id);
}