package com.banfico.banking_api.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
import java.time.LocalDateTime;

public class SecurityResponseHandlers {

    private static String buildErrorJson(int status, String error, String message) {
        return "{"
                + "\"status\":" + status + ","
                + "\"error\":\"" + error + "\","
                + "\"message\":\"" + message + "\","
                + "\"timestamp\":\"" + LocalDateTime.now() + "\""
                + "}";
    }

    public static class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

        @Override
        public void commence(
                HttpServletRequest request,
                HttpServletResponse response,
                AuthenticationException authException
        ) throws IOException {

            String json = buildErrorJson(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized",
                    "A valid access token is required to access this resource."
            );

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(json);
        }
    }

    public static class RestAccessDeniedHandler implements AccessDeniedHandler {

        @Override
        public void handle(
                HttpServletRequest request,
                HttpServletResponse response,
                AccessDeniedException accessDeniedException
        ) throws IOException {

            String json = buildErrorJson(
                    HttpServletResponse.SC_FORBIDDEN,
                    "Forbidden",
                    "You do not have permission to perform this action."
            );

            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(json);
        }
    }
}