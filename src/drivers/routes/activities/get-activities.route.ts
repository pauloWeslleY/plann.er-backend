import type { FastifyInstance } from "fastify";

import { FastifyGetActivitiesAdapter } from "@/adapters/input/http/fastify-get-activities.adapter";
import { DrizzleActivitiesRepositoryAdapter } from "@/adapters/output/persistence/drizzle-activities-repository.adapter";
import { DrizzleTripRepositoryAdapter } from "@/adapters/output/persistence/drizzle-trip-repository.adapter";
import { GetActivitiesUseCase } from "@/application/get-activities.use-case";
import { dateJS } from "@/resources/date-js/datejs";

export async function getActivitiesRoute(app: FastifyInstance) {
  const tripRepository = new DrizzleTripRepositoryAdapter();
  const activityRepository = new DrizzleActivitiesRepositoryAdapter();
  const getActivitiesUseCase = new GetActivitiesUseCase(
    tripRepository,
    activityRepository,
    {
      date: { dayjs: dateJS },
    },
  );
  const httpAdapter = new FastifyGetActivitiesAdapter(getActivitiesUseCase);

  httpAdapter.register(app);
}
