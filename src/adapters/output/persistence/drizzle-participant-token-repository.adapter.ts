import { and, eq, gt } from "drizzle-orm";

import type { ParticipantTokenRepositoryPort } from "@/application/ports/participant-token-repository.port";
import { database } from "@/resources/database";
import { schema } from "@/resources/database/schemas";

export class DrizzleParticipantTokenRepositoryAdapter implements ParticipantTokenRepositoryPort {
  async revoke(input: { token: string; expiresAt: Date }): Promise<void> {
    await database
      .insert(schema.ParticipantRevokedTokensTable)
      .values(input)
      .onConflictDoNothing();
  }

  async isRevoked(token: string): Promise<boolean> {
    const [revokedToken] = await database
      .select({ token: schema.ParticipantRevokedTokensTable.token })
      .from(schema.ParticipantRevokedTokensTable)
      .where(
        and(
          eq(schema.ParticipantRevokedTokensTable.token, token),
          gt(schema.ParticipantRevokedTokensTable.expiresAt, new Date()),
        ),
      )
      .limit(1);

    return !!revokedToken;
  }
}
