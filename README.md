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

## APIs

### Health Check

```
GET /api/health

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
### Database Health Check

```
GET /api/health/database

```

Response:

```
Application Running

```
## API Endpoints

### Customers

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/customers | Create customer |
| GET | /api/customers | Get all customers |
| GET | /api/customers/{id} | Get customer by ID |

### Bank Accounts

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/accounts | Create account |
| GET | /api/accounts | Get all accounts |
| GET | /api/accounts/{accountId} | Get account by ID |

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