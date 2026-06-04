import type { FastifyInstance } from "fastify";

import { createInviteRoute } from "./create-invite.route";

export async function inviteRoutes(app: FastifyInstance) {
  await createInviteRoute(app);
}
