# 📦 backend / worker-factory — Outbox Processing Service

A microservice for processing `review-created` outbox events from Redis and updating corresponding records in PostgreSQL.

---

## 🚀 Features

- 🔁 Scans Redis hashes with keys like `bull:review-events:review-created:*`
- 📥 Extracts `reviewId`, fetches review from PostgreSQL
- ✍️ Updates review text (`validate on BAD words with rewriting on ***, + which worker made work`)
- ✅ Updates outbox event status
- 🧠 Workers run in parallel but never duplicate processing (via Redis locks)
- 💥 All changes are wrapped in a **PostgreSQL transaction**

---

## 📁 Project Structure

```
src/
├── main.ts                  # Entry point
├── base.worker.ts           # Abstract worker class
├── worker-factory.ts        # Worker factory manager
├── types
│   └── add-review.type.ts   # Redis payload
│   └── base.worker.ts       # Base worker structure
├── workers/
│   └── review.worker.ts     # Worker that handles review-created events
├── services/
│   ├── review.service.ts    # PostgreSQL review table logic
│   ├── outbox.service.ts    # Outbox event status logic
│   └── transaction.service.ts # Handles DB transactions
```

---

## 🛠 Installation

```bash
npm install
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root:

```dotenv
WORKER_COUNT=5

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=testdb

REDIS_URL=redis://localhost:6379
```

---

## ▶️ Run

```bash
npm run dev
```

---

## ✅ Worker Behavior

- Every 1 seconds, scans Redis keys matching `bull:review-events:review-created:*`
- If the hash is not yet processed (`processed !== 'true'`) and not locked:
  - Extracts `reviewId`
  - Fetches review from DB
  - Wraps `updateReviewText()` + `updateOutboxStatus()` in a DB transaction
  - Marks the Redis hash as processed (`processed = true`)
  - Releases the Redis lock

---

## 🔒 Race Condition Prevention: Redis Lock

Uses `SET NX PX`:

- Lock key: `lock:bull:review-events:review-created:{id}`
- PX = 60 sec TTL
- Only the worker that obtained the lock can process the event

---

## 🧪 Example Redis Event

```bash
HSET bull:review-events:review-created:123 reviewId 123 text "test"
```