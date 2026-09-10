# Entidade Activity

## Visao geral

`Activity` representa uma atividade planejada dentro de uma viagem: passeio, compromisso, evento, reserva ou qualquer item com titulo e data/hora.

Arquivo principal:

- `backend/src/application/core/activity.entity.ts`

Tabela principal:

- `activities`, definida em `backend/src/resources/database/schemas/activity.table.ts`

## Responsabilidade no dominio

A entidade controla:

- titulo da atividade;
- data/hora em que ela acontece;
- status de conclusao;
- viagem a qual a atividade pertence.

Ela e sempre dependente de uma `Trip`, porque toda atividade precisa de um `tripId`.

## Propriedades da entidade

A classe usa `ActivityProps`:

```ts
interface ActivityProps {
  title: string;
  occursAt: Date;
  isDone?: boolean;
  tripId: string;
}
```

Campos expostos por getters:

- `id`: identificador unico da atividade.
- `title`: titulo da atividade.
- `occursAt`: data/hora da atividade.
- `tripId`: viagem relacionada.
- `isDone`: indica se a atividade foi concluida.

## Criacao e restauracao

Para criar uma nova atividade:

```ts
Activity.create(id, props)
```

O metodo `create` aplica uma regra padrao: se `isDone` nao for informado, ele assume `false`.

Para restaurar uma atividade existente:

```ts
Activity.restore({ id, ...props })
```

## Regras de negocio

### Status padrao

Atividades novas comecam como nao concluidas:

```ts
isDone: props.isDone ?? false
```

Essa regra evita que uma atividade recem-criada fique com estado indefinido.

### Atualizacao de status

O metodo `updateStatus` altera somente a conclusao:

```ts
updateStatus(isDone: boolean): void
```

Ele e usado quando o sistema precisa marcar ou desmarcar uma atividade como feita.

### Atualizacao parcial

O metodo `update` aceita um `Partial<ActivityProps>`:

```ts
update(props: Partial<ActivityProps>): void
```

Ele mescla os novos valores com os valores atuais. Na pratica, o caso de uso de atualizacao altera `title` e `occursAt`.

## Regras aplicadas nos casos de uso

Algumas validacoes importantes relacionadas a atividade nao estao dentro da entidade; elas aparecem nos casos de uso:

- a viagem precisa existir;
- a viagem nao pode estar cancelada;
- a data da atividade nao pode ser antes do inicio da viagem;
- a data da atividade nao pode ser depois do fim da viagem;
- nao deve haver atividade duplicada com o mesmo titulo na mesma viagem.

Isso aparece especialmente nos fluxos de criacao e atualizacao de atividade.

## Persistencia

No banco, a tabela `activities` possui:

- `id`;
- `title`;
- `occurs_at`;
- `is_done`;
- `trip_id`.

O campo `trip_id` referencia `trips.id` com `onDelete: "cascade"`. Portanto, se uma viagem for removida, suas atividades tambem sao removidas.

## Relacionamentos

Cada atividade pertence a uma unica viagem.

Uma viagem pode possuir varias atividades.

No Drizzle, a relacao e definida como:

- `ActivitiesTable` tem uma relacao `one` com `TripsTable`;
- `TripsTable` tem uma relacao `many` com `ActivitiesTable`.

## DTOs relacionados

Os principais DTOs estao em `backend/src/application/dto/activities.dto.ts`:

- `ActivityDTO`;
- `CreateActivityDTO`;
- `UpdateStatusActivityDTO`;
- `ActivitiesListDTO`;
- `ActivityDetailDTO`.

`ActivityDetailDTO` inclui tambem a viagem relacionada, o que permite validar regras de periodo e status da viagem.

## Pontos de atencao

- A entidade permite `update` com qualquer propriedade parcial, inclusive `tripId` e `isDone`; hoje os casos de uso controlam quais campos realmente mudam.
- Validacoes de periodo da viagem estao fora da entidade.
- O mapper atual de atividade converte registros do banco para DTO, mas nao ha um `ActivityMapper.toDomain`; a restauracao da entidade e feita manualmente nos casos de uso que precisam dela.
