# Banfico Banking API

A Spring Boot backend project developed as part of the Banfico Full Stack Developer Training Program.

## Tech Stack

- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Maven
- Docker
- Lombok

## Project Structure

```
controller
service
repository
entity
dto
config
exception

```

## Prerequisites

- Java 21
- Maven
- PostgreSQL
- Docker

## Database

```
CREATE DATABASE banfico;
```

## Run the Application

```
mvn spring-boot:run
```

## Build

```
mvn clean package
```

## Docker

Build:

```
docker build -t banking-api .
```

Run:

```
docker run -p 8080:8080 banking-api
```

### Full stack through the Nginx gateway

The full local stack is exposed through Nginx on port `8080`. Nginx is the
single browser entry point and routes requests to the internal services:

| URL | Destination |
|---|---|
| `http://localhost:8080/` | Frontend |
| `http://localhost:8080/api/*` | Backend API |
| `http://localhost:8080/auth/*` | Keycloak |

Start the complete stack from the repository root:

```powershell
./mvnw.cmd clean package -DskipTests
docker compose up --build -d
```

The PostgreSQL data is persisted in the `postgres-data` volume. Keycloak
imports `keycloak/realm-export.json` on first startup. The gateway publishes
basic access and error logs in `nginx/logs/` and they can also be viewed with:

```powershell
docker compose logs -f gateway
```

To stop the stack:

```powershell
docker compose down
```

## APIs

### Consent management

Authenticated users can create and review requests for a third party to access
customer account data:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/consents` | Create a pending consent request |
| GET | `/api/consents` | List consent requests |
| GET | `/api/consents/{id}` | View one consent request |
| PUT | `/api/consents/{id}/approve` | Approve a pending request |
| PUT | `/api/consents/{id}/reject` | Reject a pending request |

Consent requests contain a customer, account, third-party name, data scope,
expiry date, and status (`PENDING`, `APPROVED`, or `REJECTED`). `MAKER` users
create requests; `CHECKER` or `ADMIN` users approve or reject them.

### Health Check

```
GET /health

```

Response:

```
Application Running

```

### Project Info

```
GET /api/info

```

Response

```
{
  "application": "Banfico Banking API",
  "version": "1.0.0",
  "status": "Running",
  "javaVersion": "22.0.2",
  "serverTime": "2026-07-31T17:04:48.9103003",
  "gitBranch": "feat/api",
  "gitCommitId": "ef8ec70"
}
```
### Project Health Check

```

GET /api/health

```

Response:

```
{
  "status": "UP",
  "application": "banking-api",
  "timestamp": "2026-08-08T08:41:43.8175595"
}

```

### Database Health Check

```

GET /api/health/database

```

Response:

```
{
  "status": "UP",
  "database": "PostgreSQL",
  "connection": "ACTIVE",
  "timestamp": "2026-08-08T08:40:58.2061614"
}

```
## API Endpoints

### Customers

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/customers | Create customer |
| GET | /api/customers | Get all customers |
| GET | /api/customers/{id} | Get customer by ID |
| PUT | /api/customers/{id} | Update customer |
| DELETE | /api/customers/{id} | Delete customer |

### Bank Accounts

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/accounts | Create account |
| GET | /api/accounts | Get all accounts |
| GET | /api/accounts/{accountId} | Get account by ID |
| PUT | /api/accounts/{accountId} | Update account |
| DELETE | /api/accounts/{accountId} | Delete account |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/accounts/{accountId}/transactions | Create transaction |
| GET | /api/accounts/{accountId}/transactions | Get account transactions |

### Beneficiaries

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/beneficiaries | Create beneficiary |
| GET | /api/beneficiaries | Get beneficiaries |
| DELETE | /api/beneficiaries/{id} | Delete beneficiary |

## Validation and Error Handling

The application uses Jakarta Bean Validation for request validation
and a global exception handler for consistent error responses.

Common responses:

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found