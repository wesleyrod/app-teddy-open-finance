# 🖥️ Teddy Open Finance — Front-End

SPA de gerenciamento de clientes construída com **React 19**, **Vite 7**, **TypeScript** e **Tailwind CSS 3**.

---

## 🛠️ Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | Biblioteca de UI |
| Vite | 7 | Bundler e dev server |
| TypeScript | 5.9 | Tipagem estática |
| Tailwind CSS | 3.4 | Estilização utility-first |
| React Router | 6.30 | Roteamento (HashRouter) |
| Vitest | 4 | Testes unitários |
| React Hook Form + Zod | — | Formulários com validação |
| React Number Format | — | Máscara de valores BRL |
| Radix UI | — | Componentes acessíveis (Dialog, Select, etc.) |
| Lucide React | — | Ícones |

---

## 📂 Estrutura

```
src/
├── app/                    → App root, rotas e ProtectedRoute
├── features/
│   ├── auth/
│   │   ├── contexts/       → AuthContext (JWT + login/logout)
│   │   └── pages/          → LoginPage
│   └── clients/
│       ├── components/     → ClientCard, ClientForm, ClientModal, DeleteConfirmModal
│       ├── contexts/       → ClientsContext (CRUD + paginação)
│       └── pages/          → ClientsPage, SelectedClientsPage
├── components/
│   ├── ui/                 → Botões, inputs, dialogs (Radix + Tailwind)
│   ├── layout/             → DashboardLayout, Sidebar, Header
│   └── common/             → Componentes reutilizáveis
├── services/               → API client (axios com interceptor JWT)
└── lib/                    → Utilitários
```

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** ≥ 20
- Dependências instaladas na raiz do monorepo (`npm install --legacy-peer-deps`)

### Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_PORT` | Porta do dev server | `5173` |
| `VITE_API_URL` | URL base da API (usada pelo proxy Vite) | `http://localhost:3000` |

### Dev server

```bash
# Da raiz do monorepo
npx nx dev front-end

# Ou de dentro do diretório front-end
npm run dev
```

Acesse: **http://localhost:5173**

O Vite faz proxy das chamadas `/api/*` para a API do back-end automaticamente.

---

## 🧪 Testes

```bash
# Rodar testes
npx nx test front-end

# Com watch mode
npx nx test front-end --watch

# Com cobertura
npx nx test front-end --coverage
```

### Testes existentes

| Arquivo | Escopo |
|---|---|
| `app.spec.tsx` | Renderização do App |
| `ClientCard.spec.tsx` | Componente de Card do cliente |
| `ClientForm.spec.tsx` | Formulário de criação/edição |
| `DeleteConfirmModal.spec.tsx` | Modal de confirmação de exclusão |
| `ClientsPage.spec.tsx` | Página de listagem de clientes |
| `SelectedClientsPage.spec.tsx` | Página de clientes selecionados |

---

## 🐳 Docker

### Build da imagem

```bash
# A partir da raiz do monorepo
docker build -t teddy-frontend -f front-end/Dockerfile .
```

### Docker Compose

```bash
cd front-end
docker compose up -d
```

O container serve a aplicação via **Nginx** na porta **80** (mapeada para `FRONT_PORT` ou `5173`).

---

## 📋 Scripts Nx

| Comando | Descrição |
|---|---|
| `npx nx dev front-end` | Dev server com HMR |
| `npx nx build front-end` | Build de produção |
| `npx nx test front-end` | Testes unitários |
| `npx nx lint front-end` | Linting (ESLint) |
