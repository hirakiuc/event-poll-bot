import type { Bot, Handler, Interaction } from "../../../deps.ts";

import {
  InteractionResponseTypes,
  InteractionTypes,
  json,
  validateRequest,
  verifySignature,
} from "../../../deps.ts";

import type { HandlerOptions, Loggable } from "../../../shared.ts";

const HeaderXSignatureType = "X-Signature-Ed25519";
const HeaderXSignatureTS = "X-Signature-Timestamp";

// Verify the request based on the signature sent as a HTTP request headers.
const verifyRequest = async (
  request: Request,
  publicKey: string,
  logger: Loggable,
): Promise<Response | string> => {
  const { error } = await validateRequest(request, {
    POST: {
      headers: [HeaderXSignatureType, HeaderXSignatureTS],
    },
  });
  if (error) {
    logger.info({ message: "invalid request", error: error });
    return json({ error: error.message }, { status: error.status });
  }

  const signature = request.headers.get(HeaderXSignatureType);
  if (!signature) {
    logger.info({ message: `missing required header:${HeaderXSignatureType}` });
    return json({ error: "Bad request" }, { status: 400 });
  }

  const timestamp = request.headers.get(HeaderXSignatureTS);
  if (!timestamp) {
    logger.info({ message: `missing required header:${HeaderXSignatureTS}` });
    return json({ error: "Bad request" }, { status: 400 });
  }

  const { body, isValid } = verifySignature({
    publicKey,
    signature,
    timestamp,
    body: await request.text(),
  });
  if (!isValid) {
    return json(
      { error: "Invalid request: could not verify the request" },
      { status: 401 },
    );
  }

  return body;
};

const createMainHandler = (bot: Bot, opts: HandlerOptions): Handler => {
  const logger = opts.logger;
  const config = opts.config;
  const cmdMgr = opts.cmdMgr;

  return async (request: Request): Promise<Response> => {
    const result = await verifyRequest(
      request,
      config.discordBotPublicKey,
      logger,
    );
    if (result instanceof Response) {
      // Respond the error message
      return result;
    }

    const payload = JSON.parse(result) as Interaction;
    switch (payload.type) {
      case InteractionTypes.Ping: {
        return json({
          type: InteractionResponseTypes.Pong,
        });
      }
      case InteractionTypes.ApplicationCommand: {
        const res = await cmdMgr.onInteraction(bot, payload);
        if (res instanceof Error) {
          return json({ error: "Internal server error" }, { status: 500 });
        }

        return json({
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: res,
        });
      }
      default: {
        return json({ error: "Bad request" }, { status: 400 });
      }
    }
  };
};

export { createMainHandler };
