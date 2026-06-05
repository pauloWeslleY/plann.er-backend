import type { FastifyInstance } from "fastify";

import { FastifyUpdateActivityAdapter } from "@/adapters/input/http/fastify-update-activity.adapter";
import { DrizzleActivitiesRepositoryAdapter } from "@/adapters/output/persistence/drizzle-activities-repository.adapter";
import { UpdateActivityUseCase } from "@/application/update-activity.use-case";
import { DateService } from "@/resources/date-js/datejs";

export async function updateActivityRoute(app: FastifyInstance) {
  const activityRepository = new DrizzleActivitiesRepositoryAdapter();
  const dateService = new DateService();
  const updateActivityUseCase = new UpdateActivityUseCase(
    activityRepository,
    dateService,
  );

  const httpAdapter = new FastifyUpdateActivityAdapter(updateActivityUseCase);
  httpAdapter.register(app);
}
