import type { FastifyInstance } from "fastify";

import { FastifyGetLinksAdapter } from "@/adapters/input/http/fastify-get-links.adapter";
import { DrizzleLinkRepositoryAdapter } from "@/adapters/output/persistence/drizzle-link-repository.adapter";
import { GetLinksUseCase } from "@/application/get-links.use-case";

export async function getLinksRoute(app: FastifyInstance) {
  const linkRepository = new DrizzleLinkRepositoryAdapter();
  const getLinksUseCase = new GetLinksUseCase(linkRepository);
  const httpAdapter = new FastifyGetLinksAdapter(getLinksUseCase);

  httpAdapter.register(app);
}
