import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trip";
import { fastifySwagger } from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipants } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivities } from "./routes/get-activities";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipant } from "./routes/get-participant";
import { errorHandler } from "./error-handler";
import { env } from "./env";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "System API - Stock Manager",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(scalarAPIReference, { routePrefix: "/docs" });

app.get("/health", async () => "OK");

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipants);
app.register(createActivity);
app.register(getActivities);
app.register(createLink);
app.register(getLinks);
app.register(getParticipants);
app.register(createInvite);
app.register(updateTrip);
app.register(getTripDetails);
app.register(getParticipant);

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running!");
});
