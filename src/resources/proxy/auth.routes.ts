import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { auth } from "../auth/auth";

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    schema: {
      tags: ["Authentication"],
      summary: "Authentication",
      description: `
        Routes -
        /api/auth/sign-in/social,
        /api/auth/sign-in/email,
        /api/auth/sign-up/email,
        /api/auth/sign-out,
        /api/auth/get-session,
        /api/auth/account-info,
      `,
    },
    async handler(request, reply) {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`);

        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });
        const response = await auth.handler(req);

        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const _error = error as Error as any;
        app.log.error("Authentication Error:", _error);
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
  });
};
