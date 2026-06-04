import type { FastifyInstance } from "fastify";

import { FastifyDeleteActivityAdapter } from "@/adapters/input/http/fastify-delete-activity.adapter";
import { DrizzleActivitiesRepositoryAdapter } from "@/adapters/output/persistence/drizzle-activities-repository.adapter";
import { DeleteActivityUseCase } from "@/application/delete-activity.use-case";

export async function deleteActivityRoute(app: FastifyInstance) {
  const activityRepository = new DrizzleActivitiesRepositoryAdapter();
  const deleteActivityUseCase = new DeleteActivityUseCase(activityRepository);
  const httpAdapter = new FastifyDeleteActivityAdapter(deleteActivityUseCase);
  httpAdapter.register(app);
}
