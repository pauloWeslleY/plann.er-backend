import type { FastifyInstance } from "fastify";

import { createActivityRoute } from "./create-activity.route";
import { getActivitiesRoute } from "./get-activities.route";

export async function activityRoutes(app: FastifyInstance) {
  await createActivityRoute(app);
  await getActivitiesRoute(app);
}
