import { and, asc, eq } from "drizzle-orm";

import { type Activity } from "@/application/core/activity.entity";
import {
  type ActivityDetailDTO,
  type ActivityDTO,
  type CreateActivityDTO as DataActivityRowDTO,
} from "@/application/dto/activities.dto";
import { type ActivityRepositoryPort } from "@/application/ports/activities.repository.port";
import { database } from "@/resources/database";
import { schema } from "@/resources/database/schemas";

import { ActivityMapper } from "../mappers/activity.mapper";

export class DrizzleActivitiesRepositoryAdapter implements ActivityRepositoryPort {
  async create(data: Activity): Promise<ActivityDTO> {
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

  async update(data: DataActivityRowDTO): Promise<ActivityDTO> {
    const [result] = await database
      .update(schema.ActivitiesTable)
      .set({
        title: data.title,
        occursAt: data.occursAt,
      })
      .where(
        and(
          eq(schema.ActivitiesTable.id, data.id),
          eq(schema.ActivitiesTable.tripId, data.tripId),
        ),
      )
      .returning();

    return ActivityMapper.toDTO(result);
  }

  async findManyByTripId(tripId: string): Promise<ActivityDTO[]> {
    const result = await database
      .select()
      .from(schema.ActivitiesTable)
      .where(eq(schema.ActivitiesTable.tripId, tripId))
      .orderBy(asc(schema.ActivitiesTable.occursAt));

    return result;
  }

  async delete(id: string, tripId: string): Promise<void> {
    await database
      .delete(schema.ActivitiesTable)
      .where(
        and(
          eq(schema.ActivitiesTable.id, id),
          eq(schema.ActivitiesTable.tripId, tripId),
        ),
      );
  }

  async findById(
    id: string,
    tripId: string,
  ): Promise<ActivityDetailDTO | null> {
    const [result] = await database
      .select({
        id: schema.ActivitiesTable.id,
        title: schema.ActivitiesTable.title,
        occursAt: schema.ActivitiesTable.occursAt,
        trip: schema.TripsTable,
      })
      .from(schema.ActivitiesTable)
      .innerJoin(
        schema.TripsTable,
        eq(schema.TripsTable.id, schema.ActivitiesTable.tripId),
      )
      .where(
        and(
          eq(schema.ActivitiesTable.id, id),
          eq(schema.ActivitiesTable.tripId, tripId),
        ),
      );

    return result || null;
  }
}
