import { Context, Request, Status, verifySignature } from "../../deps.ts";

import type { Middleware } from "../../deps.ts";

const HeaderSignatureType = "X-Signature-Ed25519";
const HeaderSignatureTS = "X-Signature-Timestamp";

interface RequestTerms {
  [key: string]: {
    headers?: string[];
  };
}

type ErrorInfo = {
  message: string;
  status: number;
};

const validateRequest = (
  request: Request,
): ErrorInfo | void => {
  if (request.method != "POST") {
    return {
      message: `method ${request.method} is not allowed for the URL`,
      status: Status.MethodNotAllowed,
    };
  }

  const expectedHeaders = [
    HeaderSignatureType,
    HeaderSignatureTS,
  ];

  for (const key of expectedHeaders) {
    const v = request.headers.get(key.toLowerCase());
    if (!v) {
      return {
        message: `missing required header:${key}`,
        status: Status.BadRequest,
      };
    }
  }
};

const validate = (
  publicKey: string,
): Middleware => {
  return async (ctx: Context, next) => {
    const err = validateRequest(ctx.request);
    if (err) {
      ctx.response.type = "json";
      ctx.response.body = {
        error: err.message,
      };

      return;
    }

    const signature = ctx.request.headers.get(HeaderSignatureType);
    if (!signature) {
      ctx.response.type = "json";
      ctx.response.body = {
        error: `Missing required header:${HeaderSignatureType}`,
      };

      return;
    }
    const timestamp = ctx.request.headers.get(HeaderSignatureTS);
    if (!timestamp) {
      ctx.response.type = "json";
      ctx.response.body = {
        error: `Missing required header:${HeaderSignatureTS}`,
      };

      return;
    }

    const { isValid } = verifySignature({
      publicKey,
      signature,
      timestamp,
      body: await ctx.request.body().value,
    });
    if (!isValid) {
      ctx.response.type = "json";
      ctx.response.body = {
        error: "Invalid request: could not verify the request",
      };
      ctx.response.status = Status.Unauthorized;

      return;
    }

    await next();
  };
};

export { validate };
