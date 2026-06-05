import type { FastifyInstance } from "fastify";

import { FastifyGetTripsByOwnerAdapter } from "@/adapters/input/http/fastify-get-trips-by-owner.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { GetTripsByOwnerUseCase } from "@/application/get-trips-by-owner.use-case";

export async function getTripsByOwnerRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const getTripsByOwnerUseCase = new GetTripsByOwnerUseCase(tripRepository);
  const httpAdapter = new FastifyGetTripsByOwnerAdapter(getTripsByOwnerUseCase);

  httpAdapter.register(app);
}
