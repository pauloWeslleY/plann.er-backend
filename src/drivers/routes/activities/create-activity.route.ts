import type { FastifyInstance } from "fastify";

import { FastifyCreateActivityAdapter } from "@/adapters/input/http/fastify-create-activity.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { CreateActivityUseCase } from "@/application/create-activity.use-case";
import { dateJS } from "@/resources/date-js/datejs";

export async function createActivityRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();

  const createActivityUseCase = new CreateActivityUseCase(tripRepository, {
    date: { dayjs: dateJS },
  });

  const httpAdapter = new FastifyCreateActivityAdapter(createActivityUseCase);

  httpAdapter.register(app);
}
