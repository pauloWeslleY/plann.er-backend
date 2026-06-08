import type { FastifyInstance } from "fastify";

import { confirmTripRoute } from "./confirm-trip.route";
import { createTripRoute } from "./create-trip.route";
import { getTripByIdRoute } from "./get-trip-by-id.route";
import { getTripDetailsRoute } from "./get-trip-details.route";
import { getTripsByOwnerRoute } from "./get-trips-by-owner.route";
import { updateStatusTripRoute } from "./update-status-trip.route";
import { updateTripRoute } from "./update-trip.route";

export async function tripsRoutes(app: FastifyInstance) {
  await createTripRoute(app);
  await updateTripRoute(app);
  await updateStatusTripRoute(app);
  await confirmTripRoute(app);
  await getTripDetailsRoute(app);
  await getTripsByOwnerRoute(app);
  await getTripByIdRoute(app);
}
