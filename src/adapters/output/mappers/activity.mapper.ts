import { type ActivityDTO } from "@/application/dto/activities.dto";
import { type schema } from "@/resources/database/schemas";

export class ActivityMapper {
  static toDTO(
    activity: typeof schema.ActivitiesTable.$inferSelect,
  ): ActivityDTO {
    return {
      id: activity.id,
      title: activity.title,
      occursAt: activity.occursAt,
      isDone: activity.isDone,
      tripId: activity.tripId,
    };
  }
}
