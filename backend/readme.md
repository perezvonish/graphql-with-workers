# Backend — GraphQL + Outbox Pattern + Queue

A clean-architecture NestJS backend exposing a GraphQL API for books & reviews, persisting to PostgreSQL, and emitting **outbox events** to Redis for reliable async processing by external workers.

---

## ✨ Features

- **GraphQL API** (code-first): queries & mutations for Books/Reviews
- **Clean Architecture**: `domain` (entities/usecases) → `application` (usecases) → `infrastructure` (adapters)
- **Outbox Pattern**: transactional insert of `OutboxEvent` alongside domain changes
- **Queue integration**: Redis-backed outbox dispatcher (Bull/BullMQ-friendly layout)
- **Worker-ready**: external worker(s) consume `review-created` events and update data idempotently
- **TypeORM** persistence (PostgreSQL)

---

## 🗂 Project Structure

```
src/
├─ application/
│  └─ usecases/
│     ├─ add-review.usecase.ts
│     └─ get-books.usecase.ts
├─ domain/
│  ├─ entities/
│  │  ├─ book.entity.ts
│  │  ├─ outbox-event.entity.ts
│  │  └─ review.entity.ts
│  ├─ enums/
│  │  └─ outbox-event.enum.ts
│  ├─ events/
│  │  └─ review-added.event.ts
│  ├─ repositories/
│  │  ├─ basic.repository.ts
│  │  ├─ book.repository.ts
│  │  ├─ outbox.repository.ts
│  │  ├─ review.repository.ts
│  │  └─ transaction.repository.ts
│  ├─ tokens/
│  │  └─ tokens.ts
│  └─ types/
│     └─ add-review.type.ts
├─ infrastructure/
│  ├─ graphql/
│  │  ├─ resolvers/
│  │  │  ├─ book/
│  │  │  └─ review/
│  │  └─ types/
│  │     ├─ book.graphql.ts
│  │     └─ review.graphql.ts
│  ├─ modules/
│  │  ├─ app.module.ts
│  │  ├─ book.module.ts
│  │  ├─ review.module.ts
│  │  └─ schedule.module.ts
│  ├─ persistence/
│  │  ├─ seeds/
│  │  └─ typeorm/
│  └─ queue/
│     ├─ index.ts
│     └─ outbox.dispatcher.ts
└─ main.ts
```

---

## 🧩 Layers Overview

### Domain Layer (`/domain`)

- Business logic: `Entities`, `Events`, `Enums`, `Types`
- Repository interfaces and tokens for dependency injection

### Application Layer (`/application`)

- Use cases: handle inputs, orchestrate domain logic, emit events to outbox

### Infrastructure Layer (`/infrastructure`)

- Resolvers: GraphQL API endpoints
- Queue: outbox dispatcher (pulls pending events and publishes to Redis)
- Persistence: TypeORM models and connection logic

---

## 🚀 Usage

### Install

```bash
npm install
```

### Run

```bash
npm run start:dev
```

### Env setup

```dotenv
PORT=3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=hello

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis
```

---

## 🧪 Example GraphQL Mutation

```graphql
mutation {
  addReview(input: {
    bookId: "abc123",
    text: "Hello world"
  }) {
    id
    text
  }
}
```

### With bad words

```graphql
mutation {
  addReview(input: {
    bookId: "abc123",
    text: "Hello any bad word what u want ;)"
  }) {
    id
    text
  }
}
```

This will:
1. Persist the review to `reviews` table
2. Create a corresponding `OutboxEvent` in the same transaction
3. The dispatcher module reads the `OutboxEvent` and pushes it to Redis

---

## 🔒 Safe Processing

- Ensures **exactly-once processing** using Redis locks
- Events are never lost or duplicated
- Supports retry and idempotency

---