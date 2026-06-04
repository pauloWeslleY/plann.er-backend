import type { FastifyInstance } from "fastify";

import { createLinkRoute } from "./create-link.route";
import { getLinksRoute } from "./get-links.route";

export async function tripsRoutes(app: FastifyInstance) {
  await createLinkRoute(app);
  await getLinksRoute(app);
}
