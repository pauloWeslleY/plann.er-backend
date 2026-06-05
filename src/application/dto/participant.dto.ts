export interface IParticipant {
  id: string;
  name: string | null;
  email: string;
}

export interface IParticipantTrip {
  isConfirmed: boolean;
  tripId: string;
  participantId: string;
  isOwner: boolean;
}

export interface ParticipantRow {
  participant: IParticipant;
  participantTrip: IParticipantTrip;
}

export interface ParticipantsRow {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
  is_owner: boolean;
  trip_id: string;
}

export interface ParticipantDTO {
  id: string;
  name: string | null;
  email: string;
  isConfirmed: boolean;
  isOwner: boolean;
  tripId: string;
}

export interface GetParticipantDTO {
  id: string;
  name: string | null;
  email: string;
  isConfirmed: boolean;
}

export interface UpdateParticipantDTO {
  participantId: string;
  tripId: string;
  email: string;
  name?: string | null;
  userId?: string;
}

export interface CreateParticipantDTO {
  tripId: string;
  participants: {
    email: string;
    name?: string | null;
  }[];
}

export interface ParticipantListDTO {
  id: string;
  email: string;
  name: string | null;
}
