import type { FastifyInstance } from "fastify";

import { createActivityRoute } from "./create-activity.route";
import { deleteActivityRoute } from "./delete-activity.route";
import { getActivitiesRoute } from "./get-activities.route";
import { getActivitiesByTripRoute } from "./get-activities-by-trip.route";
import { updateActivityRoute } from "./update-activity.route";
import { updateStatusActivityRoute } from "./update-status-activity.route";

export async function activityRoutes(app: FastifyInstance) {
  await createActivityRoute(app);
  await updateActivityRoute(app);
  await deleteActivityRoute(app);
  await getActivitiesRoute(app);
  await getActivitiesByTripRoute(app);
  await updateStatusActivityRoute(app);
}
