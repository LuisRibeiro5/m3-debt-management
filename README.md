Sobre o Projeto

Este repositório contém o backend (Express + PostgreSQL) e o frontend (Vue + Vite) usados no projeto da disciplina de Programação Web.
A aplicação permite rodar API e interface gráfica separadamente, mas dentro do mesmo repositório para facilitar o entendimento da estrutura.

📁 Estrutura do Projeto
M3_PROGWEB/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── db.js
│   │   └── server.js
│   ├── sql/
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── .env (opcional)

🚀 Como rodar o Backend (Node + Express)
✔ 1. Entre na pasta do backend:
cd backend

✔ 2. Instale as dependências:
npm install

✔ 3. Configure o arquivo .env

Crie um arquivo chamado .env dentro da pasta backend/ com o seguinte conteúdo:

DB_PASSWORD=123
DB_USER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=prog_m3


(Troque os valores conforme a sua máquina.)

🗄️ Banco de Dados (PostgreSQL)

Certifique-se que você tem um banco chamado:

prog_m3


Se existir algum arquivo dentro de /backend/sql, execute as queries nele para criar as tabelas.

Exemplo com psql:

psql -U postgres -d prog_m3 -f backend/sql/arquivo.sql

▶ 4. Inicie o servidor:
node src/server.js


O backend estará rodando em:

http://localhost:3002

🎨 Como rodar o Frontend (Vue + Vite)
✔ 1. Entre na pasta:
cd frontend

✔ 2. Instale as dependências:
npm install

✔ 3. Inicie o projeto:
npm run dev


O frontend rodará na porta padrão do Vite:

http://localhost:5173

🔗 Comunicação Front ↔ Back

Para consumir a API no frontend, a URL do backend deve ser:

http://localhost:3002


Certifique-se de que:

O backend está rodando antes

O frontend está apontando para essa URL

✔ Requisitos

Node.js 18+

PostgreSQL instalado e rodando

NPM instalado