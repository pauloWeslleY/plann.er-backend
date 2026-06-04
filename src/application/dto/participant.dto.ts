import { type schema } from "@/resources/database/schemas";

type DrizzleParticipant = typeof schema.ParticipantsTable.$inferSelect;
type DrizzleParticipantTrip = typeof schema.ParticipantsTripsTable.$inferSelect;

export interface ParticipantRow {
  participant: DrizzleParticipant;
  participantTrip: DrizzleParticipantTrip;
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
