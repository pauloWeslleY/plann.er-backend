import type { FastifyInstance } from "fastify";

import { FastifyCreateLinkAdapter } from "@/adapters/input/http/fastify-create-link.adapter";
import { DrizzleLinkRepositoryAdapter } from "@/adapters/output/persistence/drizzle-link-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { CreateLinkUseCase } from "@/application/create-link.use-case";

export async function createLinkRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const linkRepository = new DrizzleLinkRepositoryAdapter();

  const createLinkUseCase = new CreateLinkUseCase(
    tripRepository,
    linkRepository,
  );

  const httpAdapter = new FastifyCreateLinkAdapter(createLinkUseCase);

  httpAdapter.register(app);
}
