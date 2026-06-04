import { fromNodeHeaders } from "better-auth/node";
import { type FastifyReply, type FastifyRequest } from "fastify";

import { auth } from "../auth/auth";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) {
    return reply.status(401).send({
      message: "Não autorizado! Usuário deve estar autenticado.",
    });
  }

  request.session = session ?? null;
}
