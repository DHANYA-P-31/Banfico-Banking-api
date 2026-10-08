package com.banfico.banking_api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_events")
public class AuditEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;

    private String actor;
    private Long customerId;
    private String resourceType;
    private Long resourceId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected AuditEvent() {
    }

    public AuditEvent(String action, String actor, Long customerId,
                      String resourceType, Long resourceId) {
        this.action = action;
        this.actor = actor;
        this.customerId = customerId;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getAction() { return action; }
    public String getActor() { return actor; }
    public Long getCustomerId() { return customerId; }
    public String getResourceType() { return resourceType; }
    public Long getResourceId() { return resourceId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
