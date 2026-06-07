export enum TripStatus {
  PLANNED = "PLANNED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export type TripStatusType = keyof typeof TripStatus;

export interface ITrip {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  isConfirmed: boolean;
  status: TripStatusType;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface TripDTO {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  isConfirmed: boolean;
  status: TripStatusType;
}
export interface TripDetailsDTO {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  isConfirmed: boolean;
  status: TripStatusType;
  userId: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface TripWithOwnerStatusRow {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  isOwner: boolean;
  status: TripStatusType;
}

export interface TripAndOwnerDTO {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  isOwner: boolean;
  isConfirmed: boolean;
  status: TripStatusType;
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
