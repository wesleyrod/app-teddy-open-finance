# 🏦 Teddy Open Finance

Sistema **full-stack** de gerenciamento de clientes, com autenticação JWT, CRUD completo, paginação, soft-delete e painel administrativo — pronto para rodar localmente via **Docker**.

---

## 📐 Arquitetura

```
┌────────────────────────────────────────────────────────────────┐
│                        Monorepo Nx                             │
│                                                                │
│  ┌──────────────────────┐       ┌───────────────────────────┐  │
│  │      front-end       │       │        back-end           │  │
│  │  React 19 · Vite 7   │──────▶│  NestJS 11 · TypeORM      │  │
│  │  TypeScript · Vitest  │ REST  │  Swagger · JWT · bcrypt   │  │
│  │  Tailwind CSS 3      │ /api  │  class-validator           │  │
│  │  Context API         │       │                           │  │
│  └──────────┬───────────┘       └────────────┬──────────────┘  │
│             │                                │                 │
│             │  :5173 (dev) / :80 (prod)       │  :3000          │
│             │                                │                 │
│             │                     ┌──────────▼──────────┐      │
│             │                     │   PostgreSQL 15     │      │
│             │                     │       :5432         │      │
│             │                     └─────────────────────┘      │
│             │                                                  │
│  ┌──────────▼──────────────────────────────────────────────┐   │
│  │              GitHub Actions CI/CD                        │   │
│  │  ci-frontend.yml (lint → test → build → docker)         │   │
│  │  ci-backend.yml  (lint → test → build)                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Estrutura do Repositório

```
/
├── front-end/          → React + Vite + TS (SPA)
│   ├── src/
│   │   ├── features/   → auth, clients
│   │   ├── components/ → ui, layout, common
│   │   └── services/   → API client (axios)
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
│
├── back-end/           → NestJS + TypeORM + PostgreSQL
│   ├── src/
│   │   ├── auth/       → Login JWT
│   │   ├── client/     → CRUD + soft-delete + viewCount
│   │   ├── user/       → Gestão de usuários
│   │   └── health/     → Healthcheck
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
│
├── .github/workflows/  → CI separado FE/BE
├── nx.json             → Configuração Nx monorepo
└── README.md           → Este arquivo
```

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Docker** e **Docker Compose** (para rodar com containers)

### 1. Clonar o repositório

```bash
git clone https://github.com/wesleyrod/app-teddy-open-finance.git
cd app-teddy-open-finance
```

### 2. Instalar dependências

```bash
npm install --legacy-peer-deps
```

### 3. Configurar variáveis de ambiente

```bash
# Back-end
cp back-end/.env.example back-end/.env

# Front-end
cp front-end/.env.example front-end/.env
```

Edite os arquivos `.env` conforme necessário (veja os READMEs de cada app para detalhes).

### 4. Subir o banco de dados (Docker)

```bash
cd back-end
docker compose up -d db
cd ..
```

### 5. Rodar em modo desenvolvimento

```bash
# Terminal 1 — Back-end
npx nx serve back-end

# Terminal 2 — Front-end
npx nx dev front-end
```

| Serviço | URL |
|---|---|
| Front-end | <http://localhost:5173> |
| API | <http://localhost:3000/api> |
| Swagger | <http://localhost:3000/docs> |
| Healthcheck | <http://localhost:3000/api/healthz> |

### 6. Rodar tudo via Docker

```bash
# Back-end (API + PostgreSQL)
cd back-end && docker compose up -d && cd ..

# Front-end (Nginx)
cd front-end && docker compose up -d && cd ..
```

---

## 🧪 Testes

```bash
# Todos os testes
npx nx run-many -t test

# Apenas front-end
npx nx test front-end

# Apenas back-end
npx nx test back-end
```

---

## 🔄 CI/CD

Os pipelines CI são **separados por aplicação** via GitHub Actions:

| Workflow | Arquivo | Trigger |
|---|---|---|
| Front-End | `.github/workflows/ci-frontend.yml` | Mudanças em `front-end/` |
| Back-End | `.github/workflows/ci-backend.yml` | Mudanças em `back-end/` |

Cada pipeline executa: **Lint → Test → Build** (+ Docker Build Check no front-end).

---

## 📈 Escalabilidade

O projeto foi pensado para escalar horizontalmente:

- **Monorepo Nx** — permite adicionar novas apps (mobile, admin) e libs compartilhadas sem duplicar infraestrutura. O graph de dependências garante builds incrementais e cache inteligente.
- **API Stateless** — cada instância da API NestJS é independente. O uso de JWT elimina sessões no servidor, permitindo múltiplas réplicas atrás de um load balancer.
- **Banco de dados isolado** — o PostgreSQL roda em container próprio, podendo ser substituído por um serviço gerenciado (RDS, Cloud SQL) em produção.
- **Front-end estático** — servido via Nginx, pode ser distribuído por CDN (CloudFront, Vercel) para latência mínima globalmente.
- **Docker Compose por app** — cada app tem seu próprio `docker-compose.yml`, facilitando deploy isolado e escalonamento independente.
- **CI/CD separado** — pipelines independentes permitem deploy parcial: atualizar apenas o front ou o back sem impactar o outro.

### Visão AWS (proposta)

```
                    ┌───────────────┐
                    │  CloudFront   │
                    │    (CDN)      │
                    └──────┬────────┘
                           │
               ┌───────────▼───────────┐
               │     S3 (front-end)    │
               └───────────────────────┘
                           │
               ┌───────────▼───────────┐
               │   ALB (Load Balancer) │
               └───────────┬───────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐  ┌─────▼──────┐  ┌─────▼──────┐
   │  ECS Task 1 │  │ ECS Task 2 │  │ ECS Task N │
   │  (NestJS)   │  │  (NestJS)  │  │  (NestJS)  │
   └──────┬──────┘  └─────┬──────┘  └─────┬──────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
               ┌───────────▼───────────┐
               │   RDS PostgreSQL      │
               │   (Multi-AZ)         │
               └───────────────────────┘
```

---

## 📚 Documentação Adicional

- [README do Front-End](./front-end/README.md)
- [README do Back-End](./back-end/README.md)
- [Swagger (API Docs)](http://localhost:3000/docs) — disponível com o servidor rodando

---
