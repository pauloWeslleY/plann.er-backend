export interface ConfirmParticipantPort {
  execute(input: { participantId: string }): Promise<{
    tripId: string;
  }>;
}
