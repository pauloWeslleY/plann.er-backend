# Entidade Link

## Visao geral

`Link` representa um link importante associado a uma viagem. Pode ser usado para guardar reserva, mapa, documento, roteiro, pagina de hospedagem ou qualquer URL util para os participantes.

Arquivo principal:

- `backend/src/application/core/link.entity.ts`

Tabela principal:

- `links`, definida em `backend/src/resources/database/schemas/link.table.ts`

## Responsabilidade no dominio

A entidade controla:

- titulo do link;
- URL;
- viagem a qual o link pertence.

Ela e uma entidade simples, sem metodos de atualizacao no momento. O comportamento principal e garantir uma representacao consistente do link no dominio.

## Propriedades da entidade

A classe usa `LinkProps`:

```ts
interface LinkProps {
  title: string;
  url: string;
  tripId: string;
}
```

Campos expostos por getters:

- `id`: identificador unico do link.
- `title`: titulo legivel do link.
- `url`: endereco do link.
- `tripId`: viagem relacionada.

## Criacao e restauracao

Para criar um novo link:

```ts
Link.create(id, props)
```

Para restaurar um link existente vindo do banco:

```ts
Link.restore({ id, ...props })
```

Assim como nas outras entidades, o construtor e privado e a instanciacao passa por metodos estaticos.

## Regras de negocio

A entidade `Link` em si ainda nao possui regras alem da estrutura dos dados.

As principais regras aparecem no caso de uso de criacao:

- a viagem precisa existir;
- a viagem precisa permitir edicao;
- nao deve existir outro link com o mesmo titulo na mesma viagem.

Se a viagem estiver cancelada, o caso de uso bloqueia a criacao do link.

## Persistencia

No banco, a tabela `links` possui:

- `id`;
- `title`;
- `url`;
- `trip_id`.

O campo `trip_id` referencia `trips.id` com `onDelete: "cascade"`. Portanto, se uma viagem for removida, os links associados tambem sao removidos.

## Relacionamentos

Cada link pertence a uma unica viagem.

Uma viagem pode possuir varios links.

No Drizzle, a relacao e definida como:

- `LinksTable` tem uma relacao `one` com `TripsTable`;
- `TripsTable` tem uma relacao `many` com `LinksTable`.

## DTOs relacionados

Os principais DTOs estao em `backend/src/application/dto/link.dto.ts`:

- `LinkRow`;
- `CreateLinkDTO`;
- `LinkDTO`;
- `InputLinkDTO`;
- `DeleteLinkDTO`;
- `LinkDetailsDTO`.

`LinkDTO` retorna apenas `id`, `title` e `url`, escondendo o `tripId` nas listagens comuns. Ja `LinkRow` e `LinkDetailsDTO` mantem mais informacoes para operacoes internas.

## Pontos de atencao

- A entidade nao tem metodo `update`; atualmente links parecem ser criados, listados e deletados.
- Validacao de URL nao esta na entidade; se necessaria, deve ser adicionada no caso de uso, no adapter HTTP ou na propria entidade.
- A regra de titulo unico por viagem esta no repositorio/caso de uso, nao no schema do banco.
