# Graphql backend + worker-pull service handler

This project implements a modular backend architecture using **NestJS**, **GraphQL**, **PostgreSQL**, **Redis**, and a **Worker service**.  
It follows **Clean Architecture principles** with domain-driven design, outbox pattern for reliable event delivery, and background processing with BullMQ.

---

## 🚀 Features

- **NestJS + GraphQL API** — type-safe schema-first approach.
- **PostgreSQL + TypeORM** — relational database with migrations.
- **Redis + BullMQ** — job queues and background processing.
- **Outbox Pattern** — reliable event publishing to external systems.
- **Worker Service** — processes background tasks and events.
- **Dockerized Setup** — local development and production ready.
- **Unit Tests** — Jest + mocks + spies for business logic validation.

---

## 📂 Project Structure

```
.
├── backend/                # NestJS GraphQL API
│   ├── src/
│   │   ├── application/    # Use cases (business logic)
│   │   ├── domain/         # Entities, events, repositories
│   │   ├── infrastructure/ # DB, Redis, external services
│   │   └── main.ts         # App entrypoint
│   └── test/               # Unit tests (just one usecase)
│
├── worker/                 # Worker service for async jobs
│   ├── src/
│   │   ├── workers/        # Queue processors (BullMQ)
│   │   ├── services/       # Business logic for jobs
│   │   └── main.ts
│
│
├── docker-compose.yml      # Local dev setup (API + DB + Redis + Worker)
├── README.md               # Project documentation (this file)
└── ...
```

---

## 🛠️ Installation

### 1. Clone repository

```bash
git clone <repo_url>
cd <project_root>
```

### 2. Install dependencies

```bash
cd backend && npm install
cd ../worker && npm install
```

### 3. Setup environment

Already done, anyway you can make any changes what you want.

```env
# PostgreSQL
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=app

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis
```

---

## ▶️ Running Locally

Using Docker:

```bash
docker-compose up --build
```

- Backend API: http://localhost:3000/graphql  
- Worker: runs automatically inside container  
- PostgreSQL: `localhost:5432`  
- Redis: `localhost:6379`

Without Docker:

```bash
cd backend && npm run start:dev
cd worker && npm run start:dev
```

---

## 🧪 Testing

Run tests with Jest:

```bash
npm run test
npm run test:watch
npm run test:cov
```

---

## 📦 Deployment

Production build:

```bash
cd backend && npm run build
cd worker && npm run build
```

Start in production:

```bash
cd backend && npm run start:prod
cd worker && npm run start:prod
```

---

## 📚 Documentation

- **GraphQL Playground** available at `/graphql`
- **Events** are stored in the `outbox` table and processed by the Worker
- **Transactions** ensure atomic consistency between DB changes and outbox messages

---

## 🏗️ Architecture Overview

### API (NestJS + GraphQL)
- Handles requests and orchestrates use cases
- Publishes domain events to Outbox

### Outbox Pattern
- Events are saved to the DB with the same transaction as domain changes
- Worker picks up events and publishes them to queues reliably

### Worker (BullMQ)
- Listens for events and jobs from Redis
- Executes background tasks (e.g., sending notifications, processing reviews)
- Implements retry & failure handling

---

## 🔑 Example Flow (Add Review)

1. **User submits review** → API (NestJS) stores Review in DB  
2. **Domain Event created** → `ReviewAddedEvent` saved in Outbox  
3. **Worker polls Outbox** → pushes event to Redis queue  
4. **Worker processes job** → executes background logic (e.g., notifications)

---

## 📌 Tech Stack

- **Language:** TypeScript
- **Framework:** NestJS
- **Database:** PostgreSQL + TypeORM
- **Cache/Queue:** Redis + BullMQ
- **Testing:** Jest
- **Containerization:** Docker + Docker Compose
- **Architecture:** Clean Architecture + Outbox Pattern

---

## 🤝 Contributing

1. Fork project
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m "Add new feature"`)
4. Push branch (`git push origin feature/new-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
