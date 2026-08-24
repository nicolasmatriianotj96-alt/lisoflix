# LisoFlix

Catálogo de filmes estilo Netflix — cadastro/login com JWT, favoritos, edição de perfil e player de vídeo. Projeto de portfólio (não é um serviço de streaming real).

**Ao vivo:**
- Site: https://lisoflix-delta.vercel.app
- API: https://lisoflix-backend.vercel.app

**Stack:** Node.js (funções serverless da Vercel) · Supabase (Postgres) · JWT · HTML/CSS/JS puro no frontend, sem build/framework.

## Estrutura do repositório

```
BackEnd/    API (rotas em BackEnd/api/*.js, formato de função serverless da Vercel)
FrontEnd/   Site estático (FrontEnd/public/*.html/js/css + catálogo de vídeos locais)
```

## Rodando o projeto na sua máquina

### Frontend (não precisa de nada instalado)

O catálogo funciona 100% sozinho, sem backend, através do botão **"Entrar como visitante"** — os filmes e vídeos são locais, os favoritos ficam salvos no navegador.

- **Mais simples:** abra `FrontEnd/public/index.html` direto no navegador (duplo clique).
- **Como servidor local** (recomendado para testar em outro dispositivo na mesma rede, ou se preferir uma URL http:// de verdade em vez de `file://`):
  ```powershell
  cd FrontEnd
  powershell -ExecutionPolicy Bypass -File servidor-local.ps1 -Porta 5500
  ```
  Depois abra http://localhost:5500 — não depende de Node, Python nem nada além do Windows.

### Backend (login/cadastro/favoritos "de verdade")

Pré-requisitos: [Node.js LTS](https://nodejs.org) e uma conta grátis no [Supabase](https://supabase.com).

1. **Instalar Node** (Windows, via winget):
   ```powershell
   winget install OpenJS.NodeJS.LTS
   ```
2. **Criar um projeto no Supabase** e, no SQL Editor, rodar o conteúdo de [`BackEnd/database.sql`](BackEnd/database.sql) para criar as tabelas.
3. **Configurar variáveis de ambiente:**
   ```powershell
   cd BackEnd
   copy .env.example .env
   ```
   Edite `.env` e preencha `SUPABASE_URL` e `SUPABASE_KEY` (Project Settings → API no painel do Supabase — use a chave `service_role`, não a `anon`) e gere um `JWT_SECRET` aleatório.
4. **Instalar dependências e o Vercel CLI** (o backend é escrito como funções serverless da Vercel, não um servidor Express tradicional — é o `vercel dev` que simula esse ambiente localmente):
   ```powershell
   npm install -g vercel
   npm install
   ```
5. **Rodar:**
   ```powershell
   vercel dev
   ```
   Por padrão sobe em `http://localhost:3000`. Se quiser testar o frontend local apontando pra esse backend, troque a constante `API_URL` no topo de `FrontEnd/public/index.js`, `index2.js` e `dashboard.js` para `http://localhost:3000/api`.

## Créditos

Os vídeos do catálogo são curtas-metragens de código aberto (Blender Foundation / Blender Studio, licença Creative Commons Attribution) e um clipe de teste de uso livre — ver [`FrontEnd/public/videos/CREDITOS.txt`](FrontEnd/public/videos/CREDITOS.txt) para a lista completa e as fontes. Nenhum conteúdo protegido por direitos autorais de terceiros é usado.
