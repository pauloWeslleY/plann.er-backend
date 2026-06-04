import type { FastifyInstance } from "fastify";

import { FastifyUpdateTripAdapter } from "@/adapters/input/http/fastify-update-trip.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { UpdateTripUseCase } from "@/application/update-trip.use-case";
import { dateJS } from "@/resources/date-js/datejs";

export async function updateTripRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const updateTripUseCase = new UpdateTripUseCase(tripRepository, {
    dayjs: dateJS,
  });
  const httpAdapter = new FastifyUpdateTripAdapter(updateTripUseCase);

  httpAdapter.register(app);
}
