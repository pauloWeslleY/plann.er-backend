import type { FastifyInstance } from "fastify";

import { FastifyUpdateStatusTripAdapter } from "@/adapters/input/http/fastify-update-status-trip.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { UpdateStatusTripUseCase } from "@/application/update-status-trip.use-case";

export async function updateStatusTripRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const updateStatusTripUseCase = new UpdateStatusTripUseCase(tripRepository);
  const httpAdapter = new FastifyUpdateStatusTripAdapter(
    updateStatusTripUseCase,
  );

  httpAdapter.register(app);
}
