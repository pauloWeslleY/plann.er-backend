import { type schema } from "@/resources/database/schemas";

export type TripRow = typeof schema.TripsTable.$inferSelect;

export enum TripStatus {
  PLANNED = "PLANNED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface TripDTO {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  isConfirmed: boolean;
}

export interface CreateTripDTO {
  userId?: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  ownerName: string;
  ownerEmail: string;
  emailsToInvite: string[];
}

export interface UpdateTripDTO {
  tripId: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
}

export interface TripWithOwnerStatusRow {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  isOwner: boolean;
  status: keyof typeof TripStatus;
}

export interface TripDetailsDTO {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  isOwner: boolean;
  isConfirmed: boolean;
  status: keyof typeof TripStatus;
}
