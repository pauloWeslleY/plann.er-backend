import cors from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { env } from "./config/env";
import { activityRoutes } from "./drivers/routes/activities/activities.routes";
import { inviteRoutes } from "./drivers/routes/create-invite/invite.routes";
import { linksRoutes } from "./drivers/routes/links/links.routes";
import { participantsRoutes } from "./drivers/routes/participants/participants.routes";
import { tripsRoutes } from "./drivers/routes/trips/trips.routes";
import { errorHandler } from "./resources/errors/error-handler";
import { authRoutes } from "./resources/proxy/auth.routes";

const app = fastify();

app.register(cors, {
  origin: [env.WEB_BASE_URL || "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
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

app.register(authRoutes);
app.register(participantsRoutes);
app.register(activityRoutes);
app.register(tripsRoutes);
app.register(linksRoutes);
app.register(inviteRoutes);

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running!");
});
