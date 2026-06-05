export enum TripStatus {
  PLANNED = "PLANNED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface ITrip {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  isConfirmed: boolean;
  status: keyof typeof TripStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface TripDTO {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  isConfirmed: boolean;
  status: keyof typeof TripStatus;
  userId: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
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
