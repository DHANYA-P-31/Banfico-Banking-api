package com.banfico.banking_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/health", "/api/health", "/api/health/database", "/api/info")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/customers")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/customers/*")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/customers/*")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/customers", "/api/customers/*")
                        .authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/accounts")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/accounts/*")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/accounts/*")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/accounts", "/api/accounts/*")
                        .authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/accounts/*/transactions")
                        .hasRole("MAKER")

                        .requestMatchers(HttpMethod.GET, "/api/accounts/*/transactions")
                        .authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/beneficiaries")
                        .hasRole("MAKER")

                        .requestMatchers(HttpMethod.DELETE, "/api/beneficiaries/*")
                        .hasAnyRole("ADMIN", "CHECKER")

                        .requestMatchers(HttpMethod.GET, "/api/beneficiaries")
                        .authenticated()

                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint(new SecurityResponseHandlers.RestAuthenticationEntryPoint())
                        .accessDeniedHandler(new SecurityResponseHandlers.RestAccessDeniedHandler())
                );

        return http.build();
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());
        return converter;
    }
}