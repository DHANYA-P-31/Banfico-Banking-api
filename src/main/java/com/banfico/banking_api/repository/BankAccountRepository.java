package com.banfico.banking_api.repository;

import com.banfico.banking_api.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BankAccountRepository
        extends JpaRepository<BankAccount, Long> {

    boolean existsByAccountNumber(String accountNumber);

    List<BankAccount> findByCustomerId(Long customerId);

    Optional<BankAccount> findByIdAndCustomerId(Long id, Long customerId);
}