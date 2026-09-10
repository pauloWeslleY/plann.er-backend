# Entidade Participant

## Visao geral

`Participant` representa uma pessoa convidada ou associada a uma viagem. No modelo atual, o participante possui dados pessoais basicos, mas o estado dele dentro de uma viagem fica na tabela de associacao `participants_trips`.

Arquivo principal:

- `backend/src/application/core/participant.entity.ts`

Tabelas relacionadas:

- `participants`, definida em `backend/src/resources/database/schemas/participant.table.ts`
- `participants_trips`, definida em `backend/src/resources/database/schemas/participants-trips.table.ts`

## Responsabilidade no dominio

A entidade controla:

- identificacao do participante;
- email;
- nome opcional;
- viagem associada no contexto carregado;
- confirmacao da participacao naquela viagem.

Ela nao representa apenas uma linha simples da tabela `participants`; ela representa o participante ja contextualizado em uma viagem, porque recebe `tripId` e `isConfirmed` dentro de `ParticipantProps`.

## Propriedades da entidade

A classe usa `ParticipantProps`:

```ts
interface ParticipantProps {
  tripId: string;
  name: string | null;
  email: string;
  isConfirmed: boolean;
}
```

Campos e metodos expostos:

- `id`: identificador unico do participante.
- `tripId`: viagem associada ao participante naquele contexto.
- `isConfirmed()`: informa se a presenca foi confirmada.
- `confirmIfNeeded()`: confirma o participante se ele ainda nao estiver confirmado.
- `update(name, email)`: atualiza nome e email.

## Criacao e restauracao

A entidade possui construtor privado e expõe:

```ts
Participant.restore(id, props)
```

Diferente de `Trip`, `Activity` e `Link`, ela nao possui um metodo `create` na classe. No fluxo atual, a criacao de participantes acontece diretamente pelo repositorio, usando os dados do DTO `CreateParticipantDTO`.

## Regras de negocio

### Confirmacao idempotente

O metodo `confirmIfNeeded` confirma o participante apenas se ele ainda nao estiver confirmado:

```ts
confirmIfNeeded(): void {
  if (!this.props.isConfirmed) {
    this.props.isConfirmed = true;
  }
}
```

Isso torna a operacao segura para chamadas repetidas: confirmar um participante ja confirmado nao muda o estado nem gera erro dentro da entidade.

### Atualizacao de dados

O metodo `update` recebe `name` e `email`:

```ts
update(name: string | null, email: string): void
```

Regra importante:

- se `name` for diferente de `null`, o nome e atualizado;
- se `name` for `null`, o nome atual e preservado;
- o email sempre e atualizado.

## Persistencia

Na tabela `participants`, ficam os dados globais do participante:

- `id`;
- `name`;
- `email`.

O campo `email` e unico no banco. Isso significa que, pelo schema atual, o mesmo email nao pode aparecer em dois registros diferentes de participante.

Na tabela `participants_trips`, ficam os dados da relacao entre participante e viagem:

- `participant_id`;
- `trip_id`;
- `is_confirmed`;
- `is_owner`.

A chave primaria e composta por `participant_id` e `trip_id`, evitando que o mesmo participante seja associado duas vezes a mesma viagem.

## Relacionamentos

Um participante pode estar associado a varias viagens pela tabela `participants_trips`.

Uma viagem pode ter varios participantes tambem pela mesma tabela.

Esse desenho cria uma relacao muitos-para-muitos entre `participants` e `trips`, com atributos extras na relacao:

- confirmacao;
- indicacao de dono.

## DTOs relacionados

Os principais DTOs estao em `backend/src/application/dto/participant.dto.ts`:

- `IParticipant`;
- `IParticipantTrip`;
- `ParticipantRow`;
- `ParticipantsRow`;
- `ParticipantDTO`;
- `GetParticipantDTO`;
- `UpdateParticipantDTO`;
- `CreateParticipantDTO`;
- `ParticipantListDTO`.

`ParticipantRow` e especialmente importante porque junta:

- dados de `participant`;
- dados da relacao `participantTrip`.

E a partir dessa combinacao que o `ParticipantMapper` restaura a entidade de dominio.

## Pontos de atencao

- A entidade nao possui getter publico para `name` e `email`; hoje esses dados sao usados principalmente via DTOs e repositorios.
- `isOwner` nao fica na entidade `Participant`; ele aparece nos DTOs e na tabela `participants_trips`.
- Como `email` e unico, o design atual trata o participante como uma identidade global baseada em email.
- A confirmacao pertence a relacao participante-viagem, nao ao participante de forma isolada.
