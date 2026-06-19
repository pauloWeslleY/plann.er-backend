import type { FastifyInstance } from "fastify";

import { FastifyUpdateStatusActivityAdapter } from "@/adapters/input/http/fastify-update-status-activity.adapter";
import { DrizzleActivitiesRepositoryAdapter } from "@/adapters/output/persistence/drizzle-activities-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { UpdateStatusActivityUseCase } from "@/application/update-status-activity.use-case";

export async function updateStatusActivityRoute(app: FastifyInstance) {
  const activityRepository = new DrizzleActivitiesRepositoryAdapter();
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const updateStatusActivityUseCase = new UpdateStatusActivityUseCase(
    activityRepository,
    tripRepository,
  );

  const httpAdapter = new FastifyUpdateStatusActivityAdapter(
    updateStatusActivityUseCase,
  );

  httpAdapter.register(app);
}
