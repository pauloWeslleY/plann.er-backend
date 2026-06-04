import type { FastifyInstance } from "fastify";

import { FastifyDeleteLinkAdapter } from "@/adapters/input/http/fastify-delete-link.adapter";
import { DrizzleLinkRepositoryAdapter } from "@/adapters/output/persistence/drizzle-link-repository.adapter";
import { DeleteLinkUseCase } from "@/application/delete-link.use-case";

export async function deleteLinkRoute(app: FastifyInstance) {
  const linkRepository = new DrizzleLinkRepositoryAdapter();
  const deleteLinkUseCase = new DeleteLinkUseCase(linkRepository);
  const httpAdapter = new FastifyDeleteLinkAdapter(deleteLinkUseCase);
  httpAdapter.register(app);
}
