export interface LogoutParticipantPort {
  execute(input: { token?: string; refreshToken?: string }): Promise<void>;
}

