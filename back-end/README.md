# ⚙️ Teddy Open Finance — Back-End

API RESTful de gerenciamento de clientes com autenticação JWT, construída com **NestJS 11**, **TypeORM** e **PostgreSQL 15**.

---

## 🛠️ Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| NestJS | 11 | Framework HTTP |
| TypeORM | 0.3 | ORM para PostgreSQL |
| PostgreSQL | 15 | Banco de dados relacional |
| Swagger | 11.2 | Documentação interativa da API |
| JWT | — | Autenticação stateless |
| bcrypt | 6 | Hash de senhas |
| class-validator | 0.14 | Validação de DTOs |
| class-transformer | 0.5 | Transformação de objetos |

---

## 📂 Estrutura

```
src/
├── app/                → AppModule, AppController
├── auth/               → Autenticação
│   ├── auth.controller.ts    → POST /api/auth/login
│   ├── auth.service.ts       → Lógica de login + JWT
│   ├── guards/               → JwtAuthGuard
│   └── dto/                  → LoginDto
├── client/             → Gestão de Clientes
│   ├── client.controller.ts  → CRUD /api/clients
│   ├── client.service.ts     → Regras de negócio
│   ├── entities/             → Client entity (soft-delete + viewCount)
│   └── dto/                  → Create, Update, Pagination DTOs
├── user/               → Gestão de Usuários
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── entities/             → User entity
├── health/             → Healthcheck
│   └── health.controller.ts  → GET /api/healthz
├── common/             → Interceptors, pipes, filtros
└── main.ts             → Bootstrap + Swagger setup
```

---

## 🔗 Endpoints da API

Prefixo global: `/api`

### Autenticação

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login (retorna JWT) | ❌ |

### Clientes

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/api/clients` | Criar cliente | 🔒 JWT |
| `GET` | `/api/clients` | Listar (paginado) | 🔒 JWT |
| `GET` | `/api/clients/:id` | Detalhe + viewCount | 🔒 JWT |
| `PATCH` | `/api/clients/:id` | Atualizar cliente | 🔒 JWT |
| `DELETE` | `/api/clients/:id` | Soft-delete | 🔒 JWT |

### Observabilidade

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/api/healthz` | Healthcheck (status, uptime) | ❌ |

### Documentação

| Rota | Descrição |
|---|---|
| `/docs` | Swagger UI interativo |

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** ≥ 20
- **PostgreSQL** 15 (ou Docker)
- Dependências instaladas na raiz (`npm install --legacy-peer-deps`)

### Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta da API | `3000` |
| `NODE_ENV` | Ambiente | `development` |
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5434` |
| `DB_USERNAME` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `admin` |
| `DB_DATABASE` | Nome do banco | `teddy_finance` |
| `JWT_SECRET` | Chave secreta do JWT | — |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `1d` |

### Subir o banco de dados

```bash
docker compose up -d db
```

### Dev server

```bash
# Da raiz do monorepo
npx nx serve back-end

# A API estará em http://localhost:3000/api
# Swagger em http://localhost:3000/docs
```

---

## 🧪 Testes

```bash
# Rodar testes
npx nx test back-end

# Com cobertura
npx nx test back-end --coverage
```

Os testes usam **Jest** com **SWC** para compilação rápida.

---

## 🐳 Docker

### Docker Compose (API + PostgreSQL)

```bash
cd back-end
docker compose up -d
```

Isso sobe:
- **PostgreSQL 15** na porta 5432
- **API NestJS** na porta 3000

### Build manual

```bash
# A partir da raiz do monorepo
docker build -t teddy-api -f back-end/Dockerfile .
```

---

## 🔐 Autenticação

A API usa **JWT Bearer Token**. Fluxo:

1. Faça `POST /api/auth/login` com `email` e `password`
2. Receba o `access_token` na resposta
3. Inclua o header `Authorization: Bearer <token>` nas requisições protegidas

Credenciais padrão de desenvolvimento:
```
Email: admin@teddy.com.br
Senha: admin123
```

---

## 📋 Scripts Nx

| Comando | Descrição |
|---|---|
| `npx nx serve back-end` | Dev server com watch |
| `npx nx build back-end` | Build de produção |
| `npx nx test back-end` | Testes unitários |
| `npx nx lint back-end` | Linting (ESLint) |
