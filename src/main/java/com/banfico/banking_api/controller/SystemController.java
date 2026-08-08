package com.banfico.banking_api.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SystemController {

    private final JdbcTemplate jdbcTemplate;

    public SystemController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("status", "UP");
        response.put("application", "banking-api");
        response.put("timestamp", LocalDateTime.now());

        return response;
    }

    @GetMapping("/health/database")
    public Map<String, Object> databaseHealth() {

        Map<String, Object> response = new LinkedHashMap<>();

        try {

            Integer result = jdbcTemplate.queryForObject(
                    "SELECT 1",
                    Integer.class
            );

            response.put("status", "UP");
            response.put("database", "PostgreSQL");
            response.put("connection", result != null && result == 1
                    ? "ACTIVE"
                    : "FAILED");

        } catch (Exception e) {

            response.put("status", "DOWN");
            response.put("database", "PostgreSQL");
            response.put("connection", "FAILED");
            response.put("error", e.getMessage());
        }

        response.put("timestamp", LocalDateTime.now());

        return response;
    }
}