package com.banfico.banking_api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KeycloakAdminService {

    private static final Logger log = LoggerFactory.getLogger(KeycloakAdminService.class);

    private final RestClient restClient;

    @Value("${keycloak.admin.server-url:http://localhost:8080/auth}")
    private String serverUrl;

    @Value("${keycloak.admin.realm:our-bank}")
    private String realm;

    @Value("${keycloak.admin.username:admin}")
    private String adminUsername;

    @Value("${keycloak.admin.password:admin}")
    private String adminPassword;

    @Value("${keycloak.admin.client-id:admin-cli}")
    private String clientId;

    public KeycloakAdminService() {
        this.restClient = RestClient.create();
    }

    public KeycloakAdminService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    public String getAdminAccessToken() {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "password");
        formData.add("client_id", clientId);
        formData.add("username", adminUsername);
        formData.add("password", adminPassword);

        String tokenUrl = normalizeUrl(serverUrl) + "/realms/master/protocol/openid-connect/token";

        Map<String, Object> response = restClient.post()
                .uri(tokenUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        if (response == null || !response.containsKey("access_token")) {
            throw new IllegalStateException("Failed to obtain Keycloak admin access token");
        }

        return (String) response.get("access_token");
    }

    public String createCustomerUser(String username, String email, String name, String temporaryPassword) {
        String token = getAdminAccessToken();
        String baseUrl = normalizeUrl(serverUrl);

        // 1. Prepare user creation payload
        Map<String, Object> userPayload = new HashMap<>();
        userPayload.put("username", username);
        userPayload.put("email", email);
        userPayload.put("firstName", name);
        userPayload.put("enabled", true);
        userPayload.put("emailVerified", true);
        userPayload.put("requiredActions", List.of("UPDATE_PASSWORD"));

        Map<String, Object> cred = new HashMap<>();
        cred.put("type", "password");
        cred.put("value", temporaryPassword);
        cred.put("temporary", true);
        userPayload.put("credentials", List.of(cred));

        String createUserUrl = baseUrl + "/admin/realms/" + realm + "/users";

        ResponseEntity<Void> response = restClient.post()
                .uri(createUserUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .body(userPayload)
                .retrieve()
                .toBodilessEntity();

        String userId = extractUserIdFromLocation(response.getHeaders().getLocation());
        if (userId == null) {
            userId = fetchUserIdByUsername(token, baseUrl, username);
        }

        if (userId == null) {
            throw new IllegalStateException("Keycloak user created but failed to retrieve user ID for " + username);
        }

        // 2. Assign CUSTOMER realm role
        assignCustomerRole(token, baseUrl, userId);

        return userId;
    }

    private String extractUserIdFromLocation(URI location) {
        if (location == null) {
            return null;
        }
        String path = location.getPath();
        if (path != null && path.contains("/")) {
            return path.substring(path.lastIndexOf('/') + 1);
        }
        return null;
    }

    private String fetchUserIdByUsername(String token, String baseUrl, String username) {
        String queryUrl = baseUrl + "/admin/realms/" + realm + "/users?username=" + username;
        List<Map<String, Object>> users = restClient.get()
                .uri(queryUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});

        if (users != null && !users.isEmpty()) {
            return (String) users.get(0).get("id");
        }
        return null;
    }

    private void assignCustomerRole(String token, String baseUrl, String userId) {
        String roleUrl = baseUrl + "/admin/realms/" + realm + "/roles/CUSTOMER";
        Map<String, Object> role = restClient.get()
                .uri(roleUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        if (role == null || !role.containsKey("id")) {
            throw new IllegalStateException("CUSTOMER role not found in Keycloak realm " + realm);
        }

        String mappingUrl = baseUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm";
        restClient.post()
                .uri(mappingUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .body(List.of(role))
                .retrieve()
                .toBodilessEntity();
    }

    public void deleteUser(String userId) {
        try {
            String token = getAdminAccessToken();
            String deleteUrl = normalizeUrl(serverUrl) + "/admin/realms/" + realm + "/users/" + userId;
            restClient.delete()
                    .uri(deleteUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Successfully deleted Keycloak user {} during rollback", userId);
        } catch (Exception e) {
            log.warn("Failed to delete Keycloak user {} during rollback: {}", userId, e.getMessage());
        }
    }

    private String normalizeUrl(String url) {
        if (url.endsWith("/")) {
            return url.substring(0, url.length() - 1);
        }
        return url;
    }
}
