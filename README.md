Here's the complete README.md file - copy and paste this directly into your `README.md`:

````markdown
# 📰 Afrolink News API

A production-ready RESTful API for a news platform with real-time analytics tracking, built with Node.js, TypeScript, and PostgreSQL.

## 🚀 Features

- **JWT Authentication** with role-based access (Author/Reader)
- **Article Management** (Create, Read, Update, Soft Delete)
- **Real-time Read Tracking** with automatic logging
- **Daily Analytics Engine** powered by Redis Bull Queue
- **Author Dashboard** with performance metrics
- **Rate Limiting** for security (5 attempts/15min for auth)
- **Public Feed** with pagination and category filtering

## 🛠 Tech Stack

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| Node.js + TypeScript | Runtime & language      |
| Express.js           | Web framework           |
| PostgreSQL + Prisma  | Database & ORM          |
| Redis + Bull         | Job queue for analytics |
| JWT + Bcrypt         | Authentication          |
| Zod                  | Validation              |
| Jest                 | Testing                 |

## 📦 Prerequisites

- Node.js v18+
- PostgreSQL v14+
- Redis v6+
- npm or yarn

## 🔧 Installation

### 1. Clone and install

```bash
git clone https://github.com/Natnael47/afrolink-news-api.git
cd afrolink-news-api
npm install
```
````

### 2. Environment Variables

Create `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/afrolink_db"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="24h"
REDIS_URL="redis://localhost:6379"
BCRYPT_ROUNDS=10
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb afrolink_db

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Redis Setup

**Windows:** Download from https://github.com/microsoftarchive/redis/releases

**Mac:**

```bash
brew install redis
brew services start redis
```

**Linux:**

```bash
sudo apt install redis-server
sudo systemctl start redis-server
```

Verify Redis is running:

```bash
redis-cli ping
# Should return: PONG
```

### 5. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Server runs at: `http://localhost:3000`

Verify with:

```bash
curl http://localhost:3000/health
```

## 🧪 Testing

```bash
# Create test database
createdb afrolink_test_db

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint           | Description           | Auth |
| ------ | ------------------ | --------------------- | ---- |
| POST   | `/api/auth/signup` | Create new account    | None |
| POST   | `/api/auth/login`  | Login & get JWT token | None |

**Signup Example:**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Test@123456",
    "role": "author"
  }'
```

**Login Example:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test@123456"
  }'
```

### Article Endpoints (Author Only)

| Method | Endpoint            | Description         | Auth         |
| ------ | ------------------- | ------------------- | ------------ |
| POST   | `/api/articles`     | Create new article  | JWT (Author) |
| GET    | `/api/articles/me`  | List my articles    | JWT (Author) |
| PUT    | `/api/articles/:id` | Update article      | JWT (Author) |
| DELETE | `/api/articles/:id` | Soft delete article | JWT (Author) |

**Create Article Example:**

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My Article",
    "content": "This is my article content with at least 50 characters to pass validation.",
    "category": "Technology",
    "status": "published"
  }'
```

### Public Endpoints

| Method | Endpoint                   | Description             | Auth     |
| ------ | -------------------------- | ----------------------- | -------- |
| GET    | `/api/articles`            | Public feed (paginated) | None     |
| GET    | `/api/articles/public/:id` | Read single article     | Optional |

**Query Parameters:**

- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `category`: Filter by category
- `author`: Partial author name match
- `q`: Keyword search in title

### Analytics Endpoints (Author Only)

| Method | Endpoint                             | Description                |
| ------ | ------------------------------------ | -------------------------- |
| GET    | `/api/author/dashboard`              | Author performance metrics |
| GET    | `/api/author/articles/:id/analytics` | Article-specific analytics |

## 📁 Project Structure

```
afrolink-news-api/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── schemas/          # Zod validation
│   ├── utils/            # Helper functions
│   ├── lib/              # External configs
│   └── app.ts            # Express app entry
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration files
├── tests/
│   ├── unit/             # Unit tests
│   └── setup.ts          # Test configuration
├── .env                  # Environment variables
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## 🔍 Troubleshooting

| Issue                         | Solution                                             |
| ----------------------------- | ---------------------------------------------------- |
| `Can't reach database server` | Check PostgreSQL: `sudo systemctl status postgresql` |
| `ECONNREFUSED 127.0.0.1:6379` | Start Redis: `redis-server`                          |
| `JWT_SECRET is not defined`   | Add `JWT_SECRET` to `.env` file                      |
| `Port 3000 already in use`    | Change PORT in `.env` or run `npx kill-port 3000`    |

### Database Reset

```bash
npx prisma migrate reset
npx prisma generate
npx prisma db push
```

## 🎯 What's Complete

✅ All 8 user stories implemented
✅ JWT authentication with role-based access
✅ Article CRUD with soft delete
✅ Public feed with pagination and filtering
✅ Read tracking with ReadLog entries
✅ Analytics engine with Bull queue (Bonus)
✅ Rate limiting implementation (Bonus)
✅ Unit tests with Jest (Bonus)
✅ TypeScript with strict mode
✅ PostgreSQL with Prisma ORM
✅ Redis integration for job queue

## 📝 Quick Start for Reviewers

```bash
# 1. Clone and install
git clone https://github.com/Natnael47/afrolink-news-api.git
cd afrolink-news-api
npm install

# 2. Setup database
createdb afrolink_db
npx prisma migrate dev

# 3. Start Redis
redis-server

# 4. Start app
npm run dev

# 5. Run tests
npm test
```

### Test Credentials

Create a test author:

```json
{
  "name": "Test Author",
  "email": "test@example.com",
  "password": "Test@123456",
  "role": "author"
}
```

## 👨‍💻 Author

**Natnael** - [GitHub](https://github.com/Natnael47)
