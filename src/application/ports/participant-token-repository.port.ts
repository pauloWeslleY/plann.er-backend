export interface ParticipantTokenRepositoryPort {
  revoke(input: { token: string; expiresAt: Date }): Promise<void>;
  isRevoked(token: string): Promise<boolean>;
}
