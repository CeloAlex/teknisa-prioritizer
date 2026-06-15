# Teknisa Prioritizer

App de priorização de issues com motor de score configurável por segmento.

**Stack:** React + Vite (frontend) · Fastify v5 + Prisma v7 (backend) · PostgreSQL

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- PostgreSQL 14 ou superior (instalado localmente ou via Docker)

---

## Configuração inicial

### 1. Clonar e instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Banco de dados

Crie um banco no PostgreSQL:

```sql
CREATE DATABASE hcm_prioritizer;
```

### 3. Variáveis de ambiente

Copie o arquivo de exemplo e preencha:

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env`:

```
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/hcm_prioritizer?schema=public"
PORT=3000
```

### 4. Gerar o cliente Prisma

```bash
cd backend
npx prisma generate
```

### 5. Executar as migrations

```bash
cd backend
npm run db:migrate
```

### 6. Popular o banco com dados iniciais

```bash
# Issues, clientes e de/para (dados extraídos do sistema original)
npm run db:seed

# Segmentos e produtos
npm run db:seed-segmentos

# Critérios de priorização padrão
npm run db:seed-criterios
```

---

## Desenvolvimento

Abra dois terminais:

**Terminal 1 — Backend** (porta 3000, com hot-reload):
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend** (porta 5173, com hot-reload):
```bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

---

## Produção (build estático servido pelo próprio backend)

```bash
cd backend
npm run serve
```

Isso faz o build do frontend e sobe o backend em http://localhost:3000 servindo o SPA.

---

## Estrutura do projeto

```
teknisa-prioritizer/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos do banco
│   │   ├── migrations/         # Histórico de migrations
│   │   ├── seed.js             # Issues, clientes, de/para
│   │   ├── seed-criterios.js   # Critérios padrão por segmento
│   │   ├── seed-segmentos.js   # Segmentos e produtos
│   │   └── raw-data.json       # Dados fonte para o seed
│   ├── server.js               # API Fastify (todos os endpoints)
│   ├── .env.example            # Modelo de variáveis de ambiente
│   └── package.json
└── frontend/
    ├── src/
    │   └── App.jsx             # Aplicação React (componente único)
    └── package.json
```

---

## Scripts disponíveis (backend/)

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia backend com hot-reload (dev) |
| `npm start` | Inicia backend sem hot-reload (prod) |
| `npm run serve` | Build frontend + inicia backend |
| `npm run db:migrate` | Aplica migrations pendentes |
| `npm run db:seed` | Popula issues, clientes e de/para |
| `npm run db:seed-criterios` | Insere critérios padrão (idempotente) |
| `npm run db:seed-segmentos` | Insere segmentos e produtos |
| `npx prisma generate` | Regenera cliente Prisma após mudar schema |
| `npx prisma studio` | UI visual do banco (dev only) |

---

## Notas para desenvolvimento

- O campo `impeditiva` fica na Issue, não no Cliente. `qtdImpeditivas` do cliente é recalculado automaticamente pelo endpoint `PUT /api/issues/bulk-impeditiva`.
- A associação issue → cliente usa um algoritmo de similaridade de 3 etapas: (1) match exato normalizado, (2) tabela de/para, (3) palavras-chave com mais de 3 caracteres.
- `slaEstourado` é um valor contínuo (dias além do limite SLA), não binário — isso evita empates na priorização.
- O segmento "HCM" exige senha (`23Nov82**`) para operações de escrita.
