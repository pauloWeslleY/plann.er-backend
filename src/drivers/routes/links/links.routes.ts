import type { FastifyInstance } from "fastify";

import { createLinkRoute } from "./create-link.route";
import { deleteLinkRoute } from "./delete-link.route";
import { getLinksRoute } from "./get-links.route";

export async function linksRoutes(app: FastifyInstance) {
  await createLinkRoute(app);
  await getLinksRoute(app);
  await deleteLinkRoute(app);
}
