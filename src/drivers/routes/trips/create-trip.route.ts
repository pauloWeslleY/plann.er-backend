import type { FastifyInstance } from "fastify";

import { FastifyCreateTripAdapter } from "@/adapters/input/http/fastify-create-trip.adapter";
import { UnitOfWorkTransaction } from "@/adapters/output/persistence/drizzle-transaction-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { CreateTripUseCase } from "@/application/create-trip.use-case";
import { dateJS } from "@/resources/date-js/datejs";
import { getMailClient } from "@/resources/mail-client/mail-client";

export async function createTripRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const transactionRepository = new UnitOfWorkTransaction();

  const createTripUseCase = new CreateTripUseCase(
    tripRepository,
    transactionRepository,
    {
      date: { dayjs: dateJS },
      mailClient: await getMailClient(),
    },
  );

  const httpAdapter = new FastifyCreateTripAdapter(createTripUseCase);

  httpAdapter.register(app);
}
