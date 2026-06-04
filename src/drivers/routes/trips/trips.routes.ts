import type { FastifyInstance } from "fastify";

import { confirmTripRoute } from "./confirm-trip.route";
import { createTripRoute } from "./create-trip.route";
import { getTripDetailsRoute } from "./get-trip-details.route";
import { updateTripRoute } from "./update-trip.route";

export async function tripsRoutes(app: FastifyInstance) {
  await createTripRoute(app);
  await updateTripRoute(app);
  await confirmTripRoute(app);
  await getTripDetailsRoute(app);
}
