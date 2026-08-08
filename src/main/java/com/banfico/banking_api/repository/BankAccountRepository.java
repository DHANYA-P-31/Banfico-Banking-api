package com.banfico.banking_api.repository;

import com.banfico.banking_api.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankAccountRepository
        extends JpaRepository<BankAccount, Long> {

    boolean existsByAccountNumber(String accountNumber);
}