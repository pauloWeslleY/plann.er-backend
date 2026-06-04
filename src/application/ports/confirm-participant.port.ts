export interface ConfirmParticipantPort {
  execute(input: { participantId: string; tripId: string }): Promise<{
    tripId: string;
  }>;
}
