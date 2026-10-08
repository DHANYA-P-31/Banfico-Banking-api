package com.banfico.banking_api.repository;

import com.banfico.banking_api.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BeneficiaryRepository
        extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByCustomerId(Long customerId);

    Optional<Beneficiary> findByIdAndCustomerId(Long id, Long customerId);
}