import type { FastifyInstance } from "fastify";

import { FastifyGetTripDetailsAdapter } from "@/adapters/input/http/fastify-get-trip-details.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { GetTripDetailsUseCase } from "@/application/get-trip-details.use-case";

export async function getTripDetailsRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const getTripDetailsUseCase = new GetTripDetailsUseCase(tripRepository);
  const httpAdapter = new FastifyGetTripDetailsAdapter(getTripDetailsUseCase);

  httpAdapter.register(app);
}
