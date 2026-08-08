package com.banfico.banking_api.service;

import com.banfico.banking_api.dto.TransactionRequest;
import com.banfico.banking_api.dto.TransactionResponse;

import java.util.List;

public interface TransactionService {

    TransactionResponse createTransaction(
            Long accountId,
            TransactionRequest request);

    List<TransactionResponse> getTransactionsByAccount(
            Long accountId);
}