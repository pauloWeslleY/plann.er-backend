import { asc, eq } from "drizzle-orm";

import {
  type ActivityRow,
  type CreateActivityDTO,
} from "@/application/dto/activities.dto";
import { type ActivityRepositoryPort } from "@/application/ports/activities.repository.port";
import { database } from "@/resources/database";
import { schema } from "@/resources/database/schemas";

export class DrizzleActivitiesRepositoryAdapter implements ActivityRepositoryPort {
  async create(data: CreateActivityDTO): Promise<ActivityRow> {
    const [result] = await database
      .insert(schema.ActivitiesTable)
      .values({
        id: data.id,
        title: data.title,
        occursAt: data.occursAt,
        tripId: data.tripId,
      })
      .returning();

    return result;
  }

  async findManyByTripId(tripId: string): Promise<ActivityRow[]> {
    const result = await database
      .select()
      .from(schema.ActivitiesTable)
      .where(eq(schema.ActivitiesTable.tripId, tripId))
      .orderBy(asc(schema.ActivitiesTable.occursAt));

    return result;
  }
}
