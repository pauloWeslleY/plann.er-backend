export interface CreateInviteDTO {
  email: string;
  tripId: string;
}

export interface InviteDTO {
  participantId: string;
  email: string | null;
}
