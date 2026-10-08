package com.banfico.banking_api.service;

import com.banfico.banking_api.entity.AuditEvent;
import com.banfico.banking_api.repository.AuditEventRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final AuditEventRepository repository;

    public AuditService(AuditEventRepository repository) {
        this.repository = repository;
    }

    public void record(String action, Long customerId, String resourceType, Long resourceId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String actor = authentication == null ? "SYSTEM" : authentication.getName();
        repository.save(new AuditEvent(action, actor, customerId, resourceType, resourceId));
    }
}
