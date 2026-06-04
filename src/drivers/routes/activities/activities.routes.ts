import type { FastifyInstance } from "fastify";

import { createActivityRoute } from "./create-activity.route";
import { deleteActivityRoute } from "./delete-activity.route";
import { getActivitiesRoute } from "./get-activities.route";
import { updateActivityRoute } from "./update-activity.route";

export async function activityRoutes(app: FastifyInstance) {
  await createActivityRoute(app);
  await updateActivityRoute(app);
  await deleteActivityRoute(app);
  await getActivitiesRoute(app);
}
