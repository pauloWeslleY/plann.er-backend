# Entidade Trip

## Visao geral

`Trip` representa uma viagem planejada dentro do sistema. Ela e a entidade central do dominio: participantes, atividades e links sempre existem associados a uma viagem.

Arquivo principal:

- `backend/src/application/core/trip.entity.ts`

Tabela principal:

- `trips`, definida em `backend/src/resources/database/schemas/trip.table.ts`

## Responsabilidade no dominio

A entidade concentra os dados e comportamentos basicos de uma viagem:

- destino da viagem;
- data de inicio;
- data de termino;
- usuario dono da viagem;
- status atual da viagem;
- validacao se a viagem ainda pode receber alteracoes.

Ela funciona como o agregado principal para regras que dependem do estado da viagem. Por exemplo, antes de criar links ou atividades, os casos de uso consultam a viagem e verificam se ela ainda pode ser editada.

## Propriedades da entidade

Na classe `Trip`, as propriedades internas ficam agrupadas em `TripProps`:

```ts
interface TripProps {
  destination: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  status: keyof typeof TripStatus;
}
```

Campos expostos por getters:

- `id`: identificador unico da viagem.
- `destination`: destino da viagem.
- `startsAt`: data/hora de inicio.
- `endsAt`: data/hora de termino.
- `userId`: identificador do usuario dono.
- `status`: status atual da viagem.

## Status da viagem

Os status sao definidos em `TripStatus`:

```ts
export enum TripStatus {
  PLANNED = "PLANNED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}
```

Significado pratico:

- `PLANNED`: viagem criada, ainda em planejamento.
- `CONFIRMED`: viagem confirmada.
- `CANCELLED`: viagem cancelada.

## Regras de negocio

### Criacao e restauracao

A entidade usa construtor privado. Isso impede que outras partes do sistema instanciem `Trip` diretamente com `new Trip(...)`.

Para criar uma viagem nova:

```ts
Trip.create(id, props)
```

Para restaurar uma viagem que veio do banco:

```ts
Trip.restore({ id, ...props })
```

Esse padrao separa bem dois momentos:

- criacao de uma nova entidade no dominio;
- reconstrucao de uma entidade ja persistida.

### Verificacao de edicao

O metodo `canBeEdited` define se a viagem pode ser alterada:

```ts
canBeEdited(status?: TripStatus): boolean
```

Atualmente, apenas viagens com status `PLANNED` ou `CONFIRMED` podem ser editadas. Viagens `CANCELLED` nao devem receber novas atividades, links ou alteracoes comuns.

Essa regra aparece em casos de uso como:

- criar atividade;
- criar link;
- atualizar viagem;
- atualizar status de atividade.

### Atualizacao de status

O metodo `updateStatus` troca o status da viagem:

```ts
updateStatus(status: TripStatus): void
```

Ele altera apenas o estado interno da entidade. A persistencia acontece depois, por meio do repositorio.

### Atualizacao de dados principais

O metodo `update` altera destino e periodo:

```ts
update(destination: string, startsAt: Date, endsAt: Date): void
```

Existe uma protecao simples: se `destination.trim()` for vazio, o metodo retorna sem alterar a entidade.

## Persistencia

No banco, a tabela `trips` possui:

- `id`;
- `destination`;
- `starts_at`;
- `ends_at`;
- `is_confirmed`;
- `status`;
- `created_at`;
- `updated_at`;
- `user_id`.

Ponto importante: a entidade `Trip` trabalha principalmente com `status`. O campo `is_confirmed` ainda existe na tabela e em alguns DTOs, mas a regra moderna parece estar migrando para o enum `status`.

## Relacionamentos

Uma viagem possui muitos:

- participantes, via tabela `participants_trips`;
- links, via tabela `links`;
- atividades, via tabela `activities`.

A tabela `trips` tambem referencia `UsersTable` pelo campo `user_id`, com `onDelete: "cascade"`.

## DTOs relacionados

Os principais DTOs estao em `backend/src/application/dto/trip.dto.ts`:

- `TripDTO`;
- `TripDetailsDTO`;
- `TripFullDetailsDTO`;
- `CreateTripDTO`;
- `UpdateTripDTO`;
- `UpdateStatusTripDTO`;
- `ManyTripsByUserDTO`;
- `ManyTripsByParticipantDTO`.

Os DTOs controlam a forma dos dados que entram e saem dos casos de uso, enquanto a entidade guarda comportamento e regras do dominio.

## Pontos de atencao

- `canBeEdited` e uma regra central: qualquer nova operacao que modifique recursos de uma viagem deve considerar esse metodo.
- O campo `is_confirmed` ainda aparece na tabela e nos DTOs, mas a entidade nao o usa diretamente.
- O metodo `update` ignora destino vazio, mas nao valida se `startsAt` vem antes de `endsAt`; essa validacao, quando necessaria, precisa estar nos casos de uso ou ser movida para a entidade.
