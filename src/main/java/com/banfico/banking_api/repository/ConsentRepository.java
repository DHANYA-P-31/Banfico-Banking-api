package com.banfico.banking_api.repository;

import com.banfico.banking_api.entity.Consent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ConsentRepository extends JpaRepository<Consent, Long> {
    List<Consent> findByCustomerId(Long customerId);
    Optional<Consent> findByIdAndCustomerId(Long id, Long customerId);
}
