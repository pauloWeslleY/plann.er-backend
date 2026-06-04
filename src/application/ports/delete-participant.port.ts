export interface DeleteParticipantPort {
  execute(input: { participantId: string; tripId: string }): Promise<void>;
}
