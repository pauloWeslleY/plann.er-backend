import type { FastifyInstance } from "fastify";

import { FastifyCreateTripAdapter } from "@/adapters/input/http/fastify-create-trip.adapter";
import { DrizzleParticipantRepositoryAdapter } from "@/adapters/output/persistence/drizzle-participant-repository.adapter";
import { UnitOfWorkTransaction } from "@/adapters/output/persistence/drizzle-transaction-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { CreateTripUseCase } from "@/application/create-trip.use-case";
import { DateService } from "@/resources/date-js/datejs";
import { EmailClient } from "@/resources/mail-client/mail-client";

export async function createTripRoute(app: FastifyInstance) {
  const participantRepository = new DrizzleParticipantRepositoryAdapter();
  const transactionRepository = new UnitOfWorkTransaction();
  const tripRepository = new DrizzleTripRepositoryAdapter();

  const createTripUseCase = new CreateTripUseCase({
    tripRepository,
    participantRepository,
    createTripServiceTransaction: transactionRepository,
    date: new DateService(),
    mail: new EmailClient(),
  });

  const httpAdapter = new FastifyCreateTripAdapter(createTripUseCase);

  httpAdapter.register(app);
}
