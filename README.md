# 🐾 VetFacility — Frontend

<p>
  <img src="https://img.shields.io/badge/React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx"/>
</p>

### 👋 Sobre o projeto

Interface web (React + Vite) da plataforma **VetFacility**, um SaaS multi-tenant de gestão para pequenos
prestadores de serviço, desenvolvida no âmbito do **Projeto de Extensão V** do curso de Tecnologia em
Análise e Desenvolvimento de Sistemas — a partir de um caso real: o MEI **Centro Estético Pet Smack**, de
Francisco Reinaldo Campos Bezerra (Messejana, Fortaleza/CE).

📦 Este é um projeto **separado do backend**. O backend (API Spring Boot) vive em
[`vetfecility`](../vetfecility) e precisa estar rodando para esta interface funcionar.

## 🖥️ Telas

- **Login** — autenticação (o cadastro de novas empresas é feito pelo administrador da plataforma - ROOT
  - direto na API/Swagger, não nesta interface).
- **Agendamentos** — calendário do dia, criação rápida de cliente/animal e de agendamento.
- **Estoque** — cadastro de produtos e indicador de estoque baixo.
- **Usuários** — lista os usuários da empresa e permite convidar novos, escolhendo um perfil de acesso
  (visível para quem tem a permissão `USUARIO_VISUALIZAR`/`USUARIO_GERENCIAR`).
- **Perfis de acesso** — cria e edita perfis customizados, marcando exatamente quais permissões cada um
  tem, agrupadas por funcionalidade (visível para quem tem `PERFIL_GERENCIAR`).

A navegação lateral se adapta automaticamente às permissões do usuário logado (armazenadas no token JWT e
expostas via `useAuth().temPermissao(codigo)`).

## 🚀 Como rodar (Docker)

Pré-requisitos: Docker e Docker Compose, e o **backend já em execução** (é ele quem cria a rede Docker
compartilhada `vetfacility_net`).

```bash
# 1) suba o backend primeiro (no projeto vetfecility)
cd ../vetfecility && docker compose up -d --build

# 2) depois suba este frontend
cd ../vetfacility-frontend
cp .env.example .env
docker compose up -d --build
```

Acesse **http://localhost:5173**. O Nginx deste container faz proxy de `/api/*` para o serviço `backend`
na rede Docker compartilhada.

Para derrubar:

```bash
docker compose down
```

## 🛠️ Rodando fora do Docker (desenvolvimento)

Requer Node.js 20+ e o backend acessível em `http://localhost:8080`.

```bash
npm install
npm run dev
```

Por padrão, o Vite atende em `http://localhost:5173` e as chamadas de API usam `/api` (relativo). Se o
backend não estiver atrás de um proxy no seu ambiente de desenvolvimento, defina a variável de ambiente
`VITE_API_URL` (ex.: `VITE_API_URL=http://localhost:8080/api npm run dev`) apontando direto para ele.

## 🧱 Stack técnica

- React 18 + Vite
- React Router
- Axios (com interceptor de token JWT e logout automático em 401)
- Nginx (build de produção, servindo os arquivos estáticos e fazendo proxy de `/api`)

## 🎯 Escopo do piloto

Cobre apenas as telas dos três módulos priorizados no Projeto de Extensão V (login, agendamento, estoque),
consumindo diretamente a API do backend. Módulo financeiro, personalização visual (logotipo) e demais
telas ficam para as próximas etapas do projeto.
