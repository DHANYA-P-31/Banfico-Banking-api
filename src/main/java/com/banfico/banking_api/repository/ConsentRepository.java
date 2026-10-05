package com.banfico.banking_api.repository;

import com.banfico.banking_api.entity.Consent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsentRepository extends JpaRepository<Consent, Long> {
}
