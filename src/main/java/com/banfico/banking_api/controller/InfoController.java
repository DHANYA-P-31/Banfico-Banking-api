package com.banfico.banking_api.controller;

import org.springframework.boot.info.GitProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class InfoController {

    private final GitProperties gitProperties;

    public InfoController(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @GetMapping("/info")
    public Map<String, Object> getInfo() {

        Map<String, Object> info = new LinkedHashMap<>();

        info.put("application", "Banfico Banking API");
        info.put("version", "1.0.0");
        info.put("status", "Running");
        info.put("javaVersion", System.getProperty("java.version"));
        info.put("serverTime", LocalDateTime.now());

        info.put("gitBranch", gitProperties.getBranch());
        info.put("gitCommitId", gitProperties.getShortCommitId());

        return info;
    }
}