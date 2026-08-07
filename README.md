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