# Banfico Banking API & Open Banking Portal

A full-stack banking platform and Open Banking consent management system built with Spring Boot 3, React (Vite), PostgreSQL, and Keycloak IAM. Developed as part of the Banfico Full Stack Developer Training Program.

---

## Architecture Overview

The system uses a single-entry Nginx Reverse Proxy Gateway routing all client traffic:

```
                      ┌─────────────────────────────────────────┐
                      │          Nginx Gateway (8080)           │
                      └────┬────────────────┬───────────────┬───┘
                           │                │               │
               ┌───────────▼──┐     ┌───────▼──────┐  ┌─────▼─────────┐
               │ React App    │     │ Spring Boot  │  │ Keycloak IAM  │
               │ Frontend     │     │ Backend      │  │  │
               │ (Port 80)    │     │ (Port 8080)  │  │ (Port 8080)   │
               └──────────────┘     └───────┬──────┘  └───────────────┘
                                            │
                                    ┌───────▼──────┐
                                    │ PostgreSQL   │
                                    │ Database     │
                                    │ (Port 5432)  │
                                    └──────────────┘
```

| Gateway URL | Destination Container | Description |
|---|---|---|
| `http://localhost:8080/` | `banking-api-frontend` | React Single Page Application |
| `http://localhost:8080/api/*` | `banking-api-backend` | Spring Boot REST API |
| `http://localhost:8080/auth/*` | `banking-api-keycloak` | Keycloak Identity & Access Management |

---

##  Tech Stack

- **Backend**: Java 21, Spring Boot 3.x, Spring Data JPA, Spring Security 
- **Frontend**: React 18, Vite, React Router v6, Keycloak JS SDK, CSS
- **Identity & Access**: Keycloak 26.x (OpenID Connect / OAuth 2.0)
- **Database**: PostgreSQL 16
- **Gateway & Infrastructure**: Nginx 1.27 Alpine, Docker & Docker Compose
- **Build Tools**: Apache Maven (`mvnw`), npm

---

## Role-Based Access Control (RBAC)

Authentication is handled via JWT tokens issued by Keycloak (`our-bank` realm). The API enforces role-based authorization across four key roles:

| Role | Target Portal | Key Capabilities |
|---|---|---|
| `ADMIN` | Staff Management | Full CRUD on Customers, Accounts, Online Banking activation & account closure |
| `MAKER` | Staff Operations | Create Transactions (Deposit/Withdrawal/Transfer), Beneficiaries, & Consent requests |
| `CHECKER` | Staff Approval | Review & Approve/Reject/Revoke Consents, view accounts and customers |
| `CUSTOMER` | Self-Service Portal (`/api/me/*`) | View/update profile, manage beneficiaries, view personal accounts & history, approve/reject/revoke own consents |

---

## Prerequisites

- **Java 21 JDK**
- **Docker & Docker Compose** (v2.0+)
- **Maven** (bundled wrapper `./mvnw` provided)
- **Node.js 18+** *(optional, for local frontend development)*

---

## Quick Start (Docker Compose)

To start the complete full-stack environment including PostgreSQL, Keycloak, Backend API, Frontend, and Nginx Gateway:

1. **Build backend JAR:**
   ```powershell
   ./mvnw.cmd clean package -DskipTests
   ```

2. **Launch full stack:**
   ```powershell
   docker compose up --build -d
   ```

3. **Access Application:**
   - **Frontend App**: [http://localhost:8080](http://localhost:8080)
   - **Keycloak Admin Console**: [http://localhost:8080/auth/admin](http://localhost:8080/auth/admin) 
   - **Backend API Health**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

4. **Stop stack:**
   ```powershell
   docker compose down
   ```

---

## Local Development Setup

### Database & Security Container Setup

Start PostgreSQL and Keycloak using Docker:

```powershell
docker compose up postgres keycloak -d
```

### Running Backend Locally

```powershell
./mvnw.cmd spring-boot:run
```

The Spring Boot backend will run on port `8080` (or `8081` depending on application configuration).

### Running Frontend Locally

```powershell
cd banking-frontend
npm install
npm run dev
```

---

## API Reference

### Health & System Info

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Root gateway health check | Public |
| `GET` | `/api/health` | Application status & timestamp | Public |
| `GET` | `/api/health/database` | PostgreSQL database connection status | Public |
| `GET` | `/api/info` | Git branch, commit ID & JVM build info | Public |

---

### Customer Self-Service (`/api/me`)

Endpoints for logged-in bank customers (`CUSTOMER` role):

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/me/profile` | View customer profile |
| `PUT` | `/api/me/profile` | Update profile information |
| `GET` | `/api/me/accounts` | Get customer's accounts |
| `GET` | `/api/me/accounts/{id}` | Get account details |
| `GET` | `/api/me/accounts/{id}/transactions` | View account transaction history |
| `GET` | `/api/me/beneficiaries` | List saved beneficiaries |
| `POST` | `/api/me/beneficiaries` | Create new beneficiary |
| `DELETE` | `/api/me/beneficiaries/{id}` | Delete beneficiary |
| `GET` | `/api/me/consents` | List customer consent requests |
| `PUT` | `/api/me/consents/{id}/approve` | Approve consent request |
| `PUT` | `/api/me/consents/{id}/reject` | Reject consent request |
| `PUT` | `/api/me/consents/{id}/revoke` | Revoke an approved consent |

---

### Customer Management (`/api/customers`)

| Method | Endpoint | Description | Allowed Roles |
|---|---|---|---|
| `POST` | `/api/customers` | Create new customer | `ADMIN` |
| `GET` | `/api/customers` | List all customers | `ADMIN`, `MAKER`, `CHECKER` |
| `GET` | `/api/customers/{id}` | Get customer by ID | `ADMIN`, `MAKER`, `CHECKER` |
| `PUT` | `/api/customers/{id}` | Update customer | `ADMIN` |
| `DELETE` | `/api/customers/{id}` | Delete customer | `ADMIN` |
| `PUT` | `/api/customers/{id}/online-banking` | Activate online banking (link Keycloak ID) | `ADMIN` |

---

### Bank Accounts (`/api/accounts`)

| Method | Endpoint | Description | Allowed Roles |
|---|---|---|---|
| `POST` | `/api/accounts` | Create account | `ADMIN` |
| `GET` | `/api/accounts` | List accounts | `ADMIN`, `MAKER`, `CHECKER` |
| `GET` | `/api/accounts/{id}` | Get account details | `ADMIN`, `MAKER`, `CHECKER` |
| `PUT` | `/api/accounts/{id}` | Update account | `ADMIN` |
| `PUT` | `/api/accounts/{id}/close` | Close bank account | `ADMIN` |
| `DELETE` | `/api/accounts/{id}` | Delete account | `ADMIN` |

---

### Transactions (`/api/accounts/{accountId}/transactions`)

| Method | Endpoint | Description | Allowed Roles |
|---|---|---|---|
| `POST` | `/api/accounts/{accountId}/transactions` | Create transaction (Deposit/Withdrawal/Transfer) | `MAKER` |
| `GET` | `/api/accounts/{accountId}/transactions` | List transaction history | `ADMIN`, `MAKER`, `CHECKER` |

---

### Beneficiaries (`/api/beneficiaries`)

| Method | Endpoint | Description | Allowed Roles |
|---|---|---|---|
| `POST` | `/api/beneficiaries` | Add beneficiary | `MAKER` |
| `GET` | `/api/beneficiaries` | List beneficiaries | `ADMIN`, `MAKER`, `CHECKER` |
| `DELETE` | `/api/beneficiaries/{id}` | Remove beneficiary | `ADMIN`, `CHECKER` |

---

### Open Banking Consents (`/api/consents`)

| Method | Endpoint | Description | Allowed Roles |
|---|---|---|---|
| `POST` | `/api/consents` | Create pending consent request | `ADMIN`, `MAKER` |
| `GET` | `/api/consents` | List consent requests | `ADMIN`, `MAKER`, `CHECKER` |
| `GET` | `/api/consents/{id}` | View consent request | `ADMIN`, `MAKER`, `CHECKER` |
| `PUT` | `/api/consents/{id}/approve` | Approve consent request | `ADMIN`, `CHECKER` |
| `PUT` | `/api/consents/{id}/reject` | Reject consent request | `ADMIN`, `CHECKER` |
| `PUT` | `/api/consents/{id}/revoke` | Revoke approved consent | `ADMIN`, `CHECKER` |

---

## Project Structure

```
banking-api/
├── docker-compose.yml       # Orchestrates gateway, backend, frontend, Keycloak, & postgres
├── Dockerfile               # Multi-stage Maven/Java build for backend
├── README.md
├── keycloak/                # Keycloak realm export configuration (our-bank realm)
├── nginx/                   # Reverse proxy configuration & logs
├── banking-frontend/        # React single page application
│   ├── src/
│   │   ├── auth/            # Auth context & Keycloak client
│   │   ├── components/      # Shared layout & UI components
│   │   ├── pages/           # Pages (Dashboard, Accounts, Consents, Customer Portal)
│   │   └── services/        # API service clients
│   └── Dockerfile
└── src/
    └── main/
        └── java/com/banfico/banking_api/
            ├── config/      # Security, CORS, Schema Migration & JWT Converter
            ├── controller/  # REST Controllers
            ├── dto/         # Request & Response Data Transfer Objects
            ├── entity/      # JPA Data Entities
            ├── exception/   # Global Exception Handling
            ├── repository/  # Spring Data JPA Repositories
            └── service/     # Business Logic & Audit Trail Services
```

---

## Validation and Error Handling

The API uses Jakarta Bean Validation for incoming requests and formats consistent error payloads:

- `200 OK` / `201 Created` / `204 No Content`
- `400 Bad Request` - Validation failures or invalid state transitions
- `401 Unauthorized` - Unauthenticated requests
- `403 Forbidden` - Insufficient role permissions
- `404 Not Found` - Resource non-existent

---
