import { Application, Context, Router } from "./deps.ts";
import { validateRequest } from "./src/handler/mod.ts";
import { Logger as logger } from "./src/logger/mod.ts";

const app = new Application();

// Logger
app.use(async (ctx: Context, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  const ua = ctx.request.headers.get("User-Agent");

  const request = {
    url: ctx.request.url.toString(),
    method: ctx.request.method,
    useragent: ua,
  };

  const response = {
    status: ctx.response.status,
  };
  // TODO: log the response body.

  const duration = {
    duration: rt,
  };

  logger.debug({
    ...request,
    ...response,
    ...duration,
  });
});

// Timing
app.use(async (ctx: Context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

const publicKey = Deno.env.get("DISCORD_PUBLIC_KEY") as string;
if (!publicKey) {
  const err = new Error(
    "Missing discord public key from environment variables.",
  );

  logger.error({
    message: err.message,
  }, err);
  Deno.exit(1);
}

app.use(validateRequest(publicKey));

const router = new Router();
router
  .get("/", (context: Context) => {
    context.response.body = "Hello World!";
  })
  .get("/reload", (context: Context) => {
    context.response.body = [1, 2];
  });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
