import { and, eq } from "drizzle-orm";

import { type Link } from "@/application/core/link.entity";
import {
  type LinkDetailsDTO,
  type LinkDTO,
  type LinkRow,
} from "@/application/dto/link.dto";
import { type LinkRepositoryPort } from "@/application/ports/link.repository.port";
import { database } from "@/resources/database";
import { schema } from "@/resources/database/schemas";

import { LinkMapper } from "../mappers/link.mapper";

export class DrizzleLinkRepositoryAdapter implements LinkRepositoryPort {
  async create(data: Link): Promise<LinkRow> {
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

  async findManyByTripId(tripId: string): Promise<LinkDTO[]> {
    const result = await database
      .select({
        id: schema.LinksTable.id,
        title: schema.LinksTable.title,
        url: schema.LinksTable.url,
        tripId: schema.LinksTable.tripId,
      })
      .from(schema.LinksTable)
      .where(eq(schema.LinksTable.tripId, tripId));

    return result.map(LinkMapper.toDTO);
  }

  async findById(id: string, tripId: string): Promise<LinkRow | null> {
    const [result] = await database
      .select()
      .from(schema.LinksTable)
      .where(
        and(eq(schema.LinksTable.id, id), eq(schema.LinksTable.tripId, tripId)),
      );

    return result ?? null;
  }

  async findByTitle(title: string, tripId: string): Promise<LinkRow | null> {
    const [result] = await database
      .select()
      .from(schema.LinksTable)
      .where(
        and(
          eq(schema.LinksTable.title, title),
          eq(schema.LinksTable.tripId, tripId),
        ),
      );

    return result ?? null;
  }

  async findLinkById(data: {
    id: string;
    tripId: string;
  }): Promise<LinkDetailsDTO | null> {
    const [result] = await database
      .select({
        id: schema.LinksTable.id,
        title: schema.LinksTable.title,
        url: schema.LinksTable.url,
        trip: schema.TripsTable,
      })
      .from(schema.LinksTable)
      .leftJoin(
        schema.TripsTable,
        eq(schema.LinksTable.tripId, schema.TripsTable.id),
      )
      .where(eq(schema.LinksTable.id, data.id));

    return result ?? null;
  }

  async delete(data: { id: string; tripId: string }): Promise<void> {
    await database
      .delete(schema.LinksTable)
      .where(
        and(
          eq(schema.LinksTable.id, data.id),
          eq(schema.LinksTable.tripId, data.tripId),
        ),
      );
  }
}
