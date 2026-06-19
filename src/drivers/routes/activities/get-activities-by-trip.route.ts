import type { FastifyInstance } from "fastify";

import { FastifyGetActivitiesByTripAdapter } from "@/adapters/input/http/fastify-get-activities-by-trip.adapter";
import { DrizzleActivitiesRepositoryAdapter } from "@/adapters/output/persistence/drizzle-activities-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { GetActivitiesByTripUseCase } from "@/application/get-activities-by-trip.use-case";

export async function getActivitiesByTripRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const activityRepository = new DrizzleActivitiesRepositoryAdapter();
  const getActivitiesByTripUseCase = new GetActivitiesByTripUseCase(
    tripRepository,
    activityRepository,
  );
  const httpAdapter = new FastifyGetActivitiesByTripAdapter(
    getActivitiesByTripUseCase,
  );

  httpAdapter.register(app);
}
