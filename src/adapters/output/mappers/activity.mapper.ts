import { type ActivityRow } from "@/application/dto/activities.dto";

export class ActivityMapper {
  static toDTO(activity: ActivityRow) {
    return {
      id: activity.id,
      title: activity.title,
      occursAt: activity.occursAt,
      tripId: activity.tripId,
    };
  }
}
