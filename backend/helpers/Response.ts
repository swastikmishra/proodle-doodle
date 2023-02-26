import { FastifyReply } from "fastify";

type ResponseSuccess = {
  status: boolean;
  response: object | string;
};

type ResponseError = {
  status: boolean;
  errors: string;
};

export const sendResponse = (
  reply: FastifyReply,
  response: object | string,
  error?: boolean,
  code?: number
): FastifyReply => {
  if (error) {
    if (!code) {
      code = 200;
    }
    return reply.code(code).send(getErrorResponse(response.toString()));
  } else {
    return reply.send(getSuccessResponse(response));
  }
};

const getErrorResponse = (errors: string): ResponseError => {
  return {
    status: false,
    errors: errors,
  };
};

const getSuccessResponse = (data: object | string): ResponseSuccess => {
  return {
    status: true,
    response: data,
  };
};
