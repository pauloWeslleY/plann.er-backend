import { eq } from "drizzle-orm";

import { type CreateLinkDTO, type LinkRow } from "@/application/dto/link.dto";
import { type LinkRepositoryPort } from "@/application/ports/link.repository.port";
import { database } from "@/resources/database";
import { schema } from "@/resources/database/schemas";

export class DrizzleLinkRepositoryAdapter implements LinkRepositoryPort {
  async create(data: CreateLinkDTO): Promise<LinkRow> {
    const [result] = await database
      .insert(schema.LinksTable)
      .values({
        id: data.id,
        title: data.title,
        url: data.url,
        tripId: data.tripId,
      })
      .returning();

    return result;
  }

  async findManyByTripId(tripId: string): Promise<Omit<LinkRow, "tripId">[]> {
    const result = await database
      .select({
        id: schema.LinksTable.id,
        title: schema.LinksTable.title,
        url: schema.LinksTable.url,
      })
      .from(schema.LinksTable)
      .where(eq(schema.LinksTable.tripId, tripId));

    return result;
  }
}
