import type { FastifyInstance } from "fastify";

import { FastifyGetTripByIdAdapter } from "@/adapters/input/http/fastify-get-trip-by-id.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { GetTripByIdUseCase } from "@/application/get-trip-by-id.use-case";

export async function getTripByIdRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const getTripByIdUseCase = new GetTripByIdUseCase(tripRepository);
  const httpAdapter = new FastifyGetTripByIdAdapter(getTripByIdUseCase);

  httpAdapter.register(app);
}
