import type { FastifyInstance } from "fastify";

import { FastifyUpdateTripAdapter } from "@/adapters/input/http/fastify-update-trip.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { UpdateTripUseCase } from "@/application/update-trip.use-case";
import { DateService } from "@/resources/date-js/datejs";

export async function updateTripRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const dateService = new DateService();
  const updateTripUseCase = new UpdateTripUseCase(tripRepository, dateService);
  const httpAdapter = new FastifyUpdateTripAdapter(updateTripUseCase);

  httpAdapter.register(app);
}
