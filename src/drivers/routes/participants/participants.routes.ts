import type { FastifyInstance } from "fastify";

import { confirmParticipantRoute } from "./confirm-participant.route";
import { createParticipantRoute } from "./create-participant.route";
import { deleteParticipantRoute } from "./delete-participant.route";
import { getParticipantRoute } from "./get-participant.route";
import { getParticipantByTripsRoute } from "./get-participant-by-trips.route";
import { getParticipantsByTripRoute } from "./get-participants-by-trip.route";
import { loginParticipantRoute } from "./login-participant.route";
import { logoutParticipantRoute } from "./logout-participant.route";
import { refreshParticipantTokenRoute } from "./refresh-participant-token.route";
import { updateParticipantRoute } from "./update-participant.route";

export async function participantsRoutes(app: FastifyInstance) {
  await confirmParticipantRoute(app);
  await createParticipantRoute(app);
  await getParticipantRoute(app);
  await getParticipantsByTripRoute(app);
  await updateParticipantRoute(app);
  await deleteParticipantRoute(app);
  await loginParticipantRoute(app);
  await logoutParticipantRoute(app);
  await refreshParticipantTokenRoute(app);
  await getParticipantByTripsRoute(app);
}
