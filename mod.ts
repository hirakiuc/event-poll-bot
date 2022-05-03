import { Application, Context, Router } from "./deps.ts";
import { validateRequest } from "./src/handler/mod.ts";
import { Logger as logger } from "./src/logger/mod.ts";

import { access_logging } from "./src/oak/middleware/mod.ts";

const app = new Application();

// Logging
app.use(access_logging);

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
