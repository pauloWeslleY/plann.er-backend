# Fluxogramas das Entidades

Este arquivo reune fluxogramas em Mermaid para visualizar o comportamento principal das entidades do backend.

## Visao geral do dominio

```mermaid
flowchart TD
  User[Usuario dono] -->|cria| Trip[Trip]
  Trip -->|possui| Activity[Activity]
  Trip -->|possui| Link[Link]
  Trip -->|relaciona via participants_trips| Participant[Participant]

  ParticipantTrip[participants_trips]
  Participant --> ParticipantTrip
  Trip --> ParticipantTrip

  ParticipantTrip --> IsConfirmed[isConfirmed]
  ParticipantTrip --> IsOwner[isOwner]
```

## Fluxo da entidade Trip

```mermaid
flowchart TD
  Start[Inicio] --> Action{Operacao sobre viagem}

  Action -->|Criar nova viagem| Create[Trip.create]
  Create --> SetProps[Define destination, startsAt, endsAt, userId e status]
  SetProps --> Persist[Repositorio salva na tabela trips]
  Persist --> End[Viagem disponivel]

  Action -->|Carregar viagem existente| Restore[Trip.restore]
  Restore --> Domain[Entidade reconstruida no dominio]
  Domain --> EditCheck{Pode ser editada?}

  EditCheck -->|status PLANNED| Editable[Permite alteracoes]
  EditCheck -->|status CONFIRMED| Editable
  EditCheck -->|status CANCELLED| Blocked[Bloqueia alteracoes]

  Editable --> Update{Tipo de alteracao}
  Update -->|Alterar destino e datas| UpdateData[trip.update]
  Update -->|Alterar status| UpdateStatus[trip.updateStatus]

  UpdateData --> EmptyDestination{Destino vazio?}
  EmptyDestination -->|Sim| Ignore[Ignora alteracao]
  EmptyDestination -->|Nao| ApplyData[Atualiza destination, startsAt e endsAt]

  UpdateStatus --> ApplyStatus[Atualiza status]
  ApplyData --> Save[Repositorio persiste alteracao]
  ApplyStatus --> Save
  Ignore --> End
  Save --> End
  Blocked --> End
```

## Fluxo da entidade Participant

```mermaid
flowchart TD
  Start[Inicio] --> Action{Operacao sobre participante}

  Action -->|Criar participante| CreateRepo[Repositorio cria registro]
  CreateRepo --> ParticipantsTable[Insere em participants]
  ParticipantsTable --> RelationTable[Insere relacao em participants_trips]
  RelationTable --> Created[Participante associado a viagem]

  Action -->|Carregar participante| Load[Busca participants + participants_trips]
  Load --> Restore[Participant.restore]
  Restore --> Domain[Entidade Participant no dominio]

  Domain --> Operation{Operacao de dominio}

  Operation -->|Confirmar presenca| ConfirmCheck{Ja esta confirmado?}
  ConfirmCheck -->|Sim| KeepConfirmed[Mantem estado atual]
  ConfirmCheck -->|Nao| Confirm[confirmIfNeeded altera isConfirmed para true]
  Confirm --> SaveConfirmation[Repositorio atualiza participants_trips]

  Operation -->|Atualizar dados| Update[participant.update]
  Update --> HasName{Name informado?}
  HasName -->|Sim| UpdateName[Atualiza name]
  HasName -->|Nao| KeepName[Preserva name atual]
  UpdateName --> UpdateEmail[Atualiza email]
  KeepName --> UpdateEmail
  UpdateEmail --> SaveParticipant[Repositorio atualiza participants]

  Created --> End[Fim]
  KeepConfirmed --> End
  SaveConfirmation --> End
  SaveParticipant --> End
```

## Fluxo da entidade Activity

```mermaid
flowchart TD
  Start[Inicio] --> Action{Operacao sobre atividade}

  Action -->|Criar atividade| FindTrip[Busca viagem]
  FindTrip --> TripExists{Viagem existe?}
  TripExists -->|Nao| NotFound[Retorna erro de viagem nao encontrada]
  TripExists -->|Sim| CanEdit{Trip pode ser editada?}

  CanEdit -->|Nao| BlockCreate[Bloqueia criacao]
  CanEdit -->|Sim| ValidateDate{Data esta dentro do periodo da viagem?}
  ValidateDate -->|Nao| InvalidDate[Retorna erro de data invalida]
  ValidateDate -->|Sim| CheckDuplicate{Ja existe atividade com mesmo titulo?}
  CheckDuplicate -->|Sim| Duplicate[Retorna erro de duplicidade]
  CheckDuplicate -->|Nao| Create[Activity.create]
  Create --> DefaultStatus[isDone padrao false]
  DefaultStatus --> Save[Repositorio salva em activities]

  Action -->|Atualizar atividade| FindActivity[Busca atividade com viagem]
  FindActivity --> ActivityExists{Atividade existe?}
  ActivityExists -->|Nao| NotFoundActivity[Retorna erro de atividade nao encontrada]
  ActivityExists -->|Sim| TripCancelled{Viagem cancelada?}
  TripCancelled -->|Sim| BlockUpdate[Bloqueia atualizacao]
  TripCancelled -->|Nao| ValidateUpdateDate{Nova data esta no periodo da viagem?}
  ValidateUpdateDate -->|Nao| InvalidUpdateDate[Retorna erro de data invalida]
  ValidateUpdateDate -->|Sim| Restore[Activity.restore]
  Restore --> Update[activity.update com title e occursAt]
  Update --> SaveUpdate[Repositorio persiste alteracao]

  Action -->|Marcar como feita ou pendente| FindStatusData[Busca atividade e viagem]
  FindStatusData --> CanUpdateStatus{Trip pode ser editada?}
  CanUpdateStatus -->|Nao| BlockStatus[Bloqueia alteracao de status]
  CanUpdateStatus -->|Sim| RestoreStatus[Activity.create ou restore com dados atuais]
  RestoreStatus --> UpdateStatus[activity.updateStatus]
  UpdateStatus --> SaveStatus[Repositorio atualiza is_done]

  Save --> End[Fim]
  SaveUpdate --> End
  SaveStatus --> End
  NotFound --> End
  BlockCreate --> End
  InvalidDate --> End
  Duplicate --> End
  NotFoundActivity --> End
  BlockUpdate --> End
  InvalidUpdateDate --> End
  BlockStatus --> End
```

## Fluxo da entidade Link

```mermaid
flowchart TD
  Start[Inicio] --> Action{Operacao sobre link}

  Action -->|Criar link| FindTrip[Busca viagem]
  FindTrip --> TripExists{Viagem existe?}
  TripExists -->|Nao| NotFound[Retorna erro de viagem nao encontrada]
  TripExists -->|Sim| CheckDuplicate{Ja existe link com mesmo titulo na viagem?}

  CheckDuplicate -->|Sim| Duplicate[Retorna erro de duplicidade]
  CheckDuplicate -->|Nao| CanEdit{Trip pode ser editada?}
  CanEdit -->|Nao| BlockCreate[Bloqueia criacao]
  CanEdit -->|Sim| Create[Link.create]
  Create --> Save[Repositorio salva em links]

  Action -->|Listar links da viagem| FindMany[Busca links por tripId]
  FindMany --> ToDTO[Mapeia para LinkDTO]
  ToDTO --> ReturnList[Retorna lista sem expor detalhes internos]

  Action -->|Deletar link| FindLink[Busca link por id]
  FindLink --> LinkExists{Link existe?}
  LinkExists -->|Nao| NotFoundLink[Retorna erro de link nao encontrado]
  LinkExists -->|Sim| HasTrip{Link esta associado a uma viagem?}
  HasTrip -->|Nao| InvalidLink[Retorna erro de associacao]
  HasTrip -->|Sim| Delete[Repositorio remove de links]

  Save --> End[Fim]
  ReturnList --> End
  Delete --> End
  NotFound --> End
  Duplicate --> End
  BlockCreate --> End
  NotFoundLink --> End
  InvalidLink --> End
```

## Relacionamento entre tabelas

```mermaid
flowchart LR
  UsersTable[(users)] -->|1:N user_id| TripsTable[(trips)]
  TripsTable -->|1:N trip_id| ActivitiesTable[(activities)]
  TripsTable -->|1:N trip_id| LinksTable[(links)]

  ParticipantsTable[(participants)] -->|1:N participant_id| ParticipantsTripsTable[(participants_trips)]
  TripsTable -->|1:N trip_id| ParticipantsTripsTable

  ParticipantsTripsTable --> RelationData[is_confirmed e is_owner]
```
