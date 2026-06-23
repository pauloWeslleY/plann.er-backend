import { type FastifyInstance } from "fastify";

import { FastifyGetParticipantByTripsAdapter } from "@/adapters/input/http/fastify-get-participant-by-trips.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { GetParticipantByTripsUseCase } from "@/application/get-participant-by-trips.use-case";

export async function getParticipantByTripsRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const getParticipantByTripsUseCase = new GetParticipantByTripsUseCase(
    tripRepository,
  );
  const httpAdapter = new FastifyGetParticipantByTripsAdapter(
    getParticipantByTripsUseCase,
  );

  httpAdapter.register(app);
}
