import { type FastifyError, type FastifyInstance } from "fastify";
import z, { ZodError } from "zod";

import { AppError } from "./app-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  const _error = error as FastifyError;

  if (_error instanceof ZodError) {
    return reply.status(400).send({
      message: "Invalid input",
      errors: z.treeifyError(_error),
    });
  }

  if (_error instanceof AppError) {
    return reply.status(_error.statusCode).send({
      message: _error.message,
    });
  }

  if (_error.validation) {
    return reply.status(400).send({
      message: "Validation error",
      details: _error.validation,
    });
  }

  request.log.error(_error);
  console.log("[ERROR HANDLER] => ", _error);
  return reply.status(500).send({
    message: "Internal server error",
  });
};
