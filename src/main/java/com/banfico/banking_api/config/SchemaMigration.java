package com.banfico.banking_api.config;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
public class SchemaMigration {
    private final JdbcTemplate jdbcTemplate;

    public SchemaMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void migrateExistingRows() {
        jdbcTemplate.execute("""
                ALTER TABLE customers
                ADD COLUMN IF NOT EXISTS customer_number varchar(255),
                ADD COLUMN IF NOT EXISTS keycloak_user_id varchar(255),
                ADD COLUMN IF NOT EXISTS status varchar(255)
                """);
        jdbcTemplate.execute("""
                ALTER TABLE accounts
                ADD COLUMN IF NOT EXISTS status varchar(255)
                """);
        jdbcTemplate.update("UPDATE customers SET status = 'ACTIVE' WHERE status IS NULL");
        jdbcTemplate.update("UPDATE accounts SET status = 'ACTIVE' WHERE status IS NULL");
        jdbcTemplate.update("UPDATE customers SET customer_number = CONCAT('CUST', LPAD(id::text, 6, '0')) WHERE customer_number IS NULL");
    }
}
