import { Oak, Status, verifySignature } from "../../../deps.ts";

import type { Loggable } from "../../../shared.ts";

import { json } from "../response.ts";

const HeaderXSignatureType = "X-Signature-Ed25519";
const HeaderXSignatureTS = "X-Signature-Timestamp";

const createVerifierMiddleware = (
  logger: Loggable,
  publicKey: string,
): Oak.Middleware => {
  return async (
    ctx: Oak.Context,
    next: () => Promise<unknown>,
  ): Promise<unknown> => {
    const req = ctx.request;
    logger.debug({ request: req });

    // Ignore request, except for POST request.
    if (req.method !== "POST" || req.url.pathname !== "/") {
      logger.debug(
        "[verifier] It's not a POST request to the root path. ignore.",
      );
      return next();
    }

    const signatureType = req.headers.get(HeaderXSignatureType);
    if (!signatureType) {
      logger.debug({
        message: `missing required header:${HeaderXSignatureType}`,
      });
      return json(ctx, { message: "Bad request" }, Status.BadRequest);
    }

    const signatureTs = req.headers.get(HeaderXSignatureTS);
    if (!signatureTs) {
      logger.debug({
        message: `missing required header:${HeaderXSignatureTS}`,
      });
      return json(ctx, { message: "Bad request" }, Status.BadRequest);
    }

    // Read the request body as a string value for the verifySignature method.
    const body = await req.body({ type: "text" }).value;

    const result = verifySignature({
      publicKey: publicKey,
      signature: signatureType,
      timestamp: signatureTs,
      body: body,
    });
    if (!result.isValid) {
      logger.debug({ message: "Invalid signature" });
      return json(ctx, {
        message: "Invalid request: couldn't verify the request.",
      }, Status.Unauthorized);
    }

    return next();
  };
};

export { createVerifierMiddleware };
