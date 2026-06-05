# Backend - Plann.er

Backend da aplicacao de planejamento de viagens inspirada no projeto NLW Journey. A API permite criar uma viagem, convidar participantes, confirmar presencas, organizar atividades por data e salvar links importantes para consulta durante o planejamento.

## Proposito

O objetivo do backend e centralizar as regras de negocio da jornada de uma viagem:

- criar viagens com destino, data inicial, data final e dono;
- convidar participantes por e-mail;
- confirmar viagens e participantes;
- listar detalhes da viagem;
- cadastrar, atualizar e remover atividades;
- cadastrar e remover links importantes;
- controlar o status da viagem, como planejada, confirmada ou cancelada.

Na pratica, ele funciona como a camada de API consumida pelo frontend, cuidando de validacoes, persistencia, autenticacao e envio de e-mails.

## Tecnologias

- Node.js
- TypeScript
- Fastify
- Zod
- Drizzle ORM
- PostgreSQL
- Better Auth
- Nodemailer
- Day.js

## Arquitetura

O projeto segue uma organizacao proxima de Clean Architecture / Hexagonal Architecture.

```txt
src/
  server.ts
  application/
    core/
    dto/
    ports/
    *.use-case.ts
  adapters/
    input/http/
    output/persistence/
    output/mappers/
  drivers/
    routes/
  resources/
    database/
    errors/
    middleware/
    mail-client/
    auth/
```

### Camadas principais

`application`

Contem os casos de uso e regras de negocio da aplicacao. Exemplos:

- `create-trip.use-case.ts`
- `confirm-trip.use-case.ts`
- `update-trip.use-case.ts`
- `create-activity.use-case.ts`
- `create-link.use-case.ts`

`application/core`

Contem entidades de dominio, como `Trip`, onde ficam regras relacionadas ao comportamento da viagem.

`application/ports`

Define contratos que os casos de uso precisam para funcionar, como repositorios e servicos externos. Isso evita que a regra de negocio dependa diretamente de banco, HTTP ou bibliotecas especificas.

`adapters/input/http`

Contem os adapters Fastify. Eles recebem requisicoes HTTP, validam parametros/body com Zod e chamam os casos de uso.

`adapters/output/persistence`

Contem implementacoes reais dos repositorios usando Drizzle ORM e PostgreSQL.

`drivers/routes`

Faz a composicao das dependencias: instancia repositories, use cases e adapters HTTP, registrando tudo no Fastify.

`resources`

Agrupa detalhes de infraestrutura, como banco de dados, autenticacao, middleware, envio de e-mail e tratamento global de erros.

## Fluxo de uma requisicao

Exemplo: criar uma atividade.

```txt
HTTP POST /trips/:tripId/activity
  -> FastifyCreateActivityAdapter
    -> CreateActivityUseCase
      -> ActivityRepositoryPort
        -> DrizzleActivitiesRepositoryAdapter
          -> PostgreSQL
```

O adapter HTTP conhece Fastify. O use case conhece apenas contratos da aplicacao. O repository adapter conhece Drizzle e o banco.

## Principais recursos da API

### Trips

- criar viagem;
- confirmar viagem;
- atualizar destino e datas;
- buscar detalhes da viagem;
- listar viagens por usuario.

### Participants

- adicionar participante;
- confirmar participante;
- atualizar participante;
- remover participante;
- listar participantes da viagem.

### Activities

- criar atividade;
- listar atividades agrupadas por data;
- atualizar atividade;
- remover atividade.

### Links

- criar links importantes;
- listar links da viagem;
- remover links.

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do backend. As variaveis esperadas pela aplicacao incluem:

```env
DATABASE_URL=
POSTGRES_URL=
API_BASE_URL=
WEB_BASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
PORT=3333
```

`POSTGRES_URL` e usado pelo Drizzle para acessar o PostgreSQL.

`API_BASE_URL` e usado para montar links de confirmacao enviados por e-mail.

`WEB_BASE_URL` e usado para redirecionamentos para o frontend.

## Banco de dados

O projeto usa PostgreSQL via Docker Compose.

Para subir o banco:

```bash
docker compose up -d
```

Para gerar migrations:

```bash
npm run db:generate
```

Para aplicar migrations:

```bash
npm run db:migrate
```

Em desenvolvimento local, tambem existe o comando:

```bash
npm run db:push
```

## Rodando localmente

Instale as dependencias:

```bash
npm install
```

Suba o banco:

```bash
docker compose up -d
```

Aplique as migrations:

```bash
npm run db:migrate
```

Inicie o servidor:

```bash
npm run dev
```

Por padrao, a API roda em:

```txt
http://localhost:3333
```

A documentacao da API fica disponivel em:

```txt
http://localhost:3333/docs
```

## Scripts

```bash
npm run dev
```

Executa o servidor em modo desenvolvimento com `tsx watch`.

```bash
npm run build
```

Gera o build de producao com `tsup`.

```bash
npm run start
```

Executa o build gerado em `dist`.

```bash
npm run db:generate
```

Gera novas migrations a partir dos schemas do Drizzle.

```bash
npm run db:migrate
```

Aplica migrations pendentes no banco.

```bash
npm run lint
```

Executa o ESLint.

```bash
npm run format
```

Formata o projeto com Prettier.

## Observacoes de dominio

O status da viagem representa o estado atual dela no sistema. Datas como `startsAt` e `endsAt` indicam o periodo planejado da viagem, enquanto `status` controla o ciclo de vida da viagem.

Exemplo de status:

```ts
PLANNED;
CONFIRMED;
CANCELLED;
```

Essa separacao permite que o sistema bloqueie alteracoes em viagens canceladas sem depender apenas da data final da viagem.

