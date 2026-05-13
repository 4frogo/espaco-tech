# CRM Profissional para Empresas

Sistema de CRM completo com **Node.js/Express**, **React** e **PostgreSQL**.

## Funcionalidades

- **Gestão de Clientes**: Cadastro, edição, exclusão e visualização de clientes
- **Pipeline de Vendas**: Acompanhamento de negócios por estágios
- **Tarefas & Agenda**: Compromissos, lembretes e tarefas com prioridades
- **Dashboard**: Métricas e KPIs em tempo real
- **API REST**: Para integrações externas

## Estrutura do Projeto

```
crm-empresarial/
├── backend/          # Servidor Node.js/Express
│   ├── src/
│   │   ├── config/   # Configuração do banco
│   │   ├── models/   # Modelos Sequelize
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   └── .env
└── frontend/         # React + Vite + Tailwind
    └── src/
        ├── components/
        ├── pages/
        └── services/
```

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## Configuração do Banco de Dados

1. Crie o banco no PostgreSQL:
```sql
CREATE DATABASE crm_db;
```

2. Configure o `.env` do backend:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_db
DB_USER=postgres
DB_PASSWORD=sua_senha
```

## Instalação

### Backend:
```bash
cd backend
npm install
npm run dev
```

O servidor roda em `http://localhost:5000`

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

O frontend roda em `http://localhost:5173`

## API Endpoints

### Clientes
- `GET /api/customers` - Listar todos
- `GET /api/customers/:id` - Buscar por ID
- `POST /api/customers` - Criar
- `PUT /api/customers/:id` - Atualizar
- `DELETE /api/customers/:id` - Excluir

### Negócios
- `GET /api/deals` - Listar todos
- `GET /api/deals/pipeline` - Pipeline por estágio
- `POST /api/deals` - Criar negócio
- `PUT /api/deals/:id` - Atualizar
- `DELETE /api/deals/:id` - Excluir

### Tarefas
- `GET /api/tasks` - Listar todas
- `GET /api/tasks/calendar` - Tarefas por período
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar
- `DELETE /api/tasks/:id` - Excluir

### Dashboard
- `GET /api/dashboard` - Métricas consolidadas

## Tecnologias

**Backend:**
- Node.js + Express
- Sequelize ORM
- PostgreSQL
- CORS

**Frontend:**
- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- Recharts
- Lucide React (ícones)

## Próximos Passos Sugeridos

- [ ] Autenticação e autorização (JWT)
- [ ] Upload de arquivos
- [ ] Envio de emails
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Websockets para atualizações em tempo real
- [ ] Dockerização
- [ ] Testes automatizados

## Licença

MIT
