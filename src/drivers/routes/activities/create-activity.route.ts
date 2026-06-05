import type { FastifyInstance } from "fastify";

import { FastifyCreateActivityAdapter } from "@/adapters/input/http/fastify-create-activity.adapter";
import { DrizzleActivitiesRepositoryAdapter } from "@/adapters/output/persistence/drizzle-activities-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { CreateActivityUseCase } from "@/application/create-activity.use-case";
import { DateService } from "@/resources/date-js/datejs";

export async function createActivityRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const activityRepository = new DrizzleActivitiesRepositoryAdapter();
  const dateService = new DateService();

  const createActivityUseCase = new CreateActivityUseCase(
    tripRepository,
    activityRepository,
    dateService,
  );

  const httpAdapter = new FastifyCreateActivityAdapter(createActivityUseCase);
  httpAdapter.register(app);
}
