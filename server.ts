import { Server } from "https://deno.land/std@0.140.0/http/server.ts";
import { createLogger } from "./src/logger/mod.ts";

const HOSTNAME = "0.0.0.0";
const PORT = 8080;

const logger = createLogger();

const handler = (_request: Request): Promise<Response> => {
  const data = JSON.stringify({ message: "OK" });
  return Promise.resolve(
    new Response(data, { status: 200 }),
  );
};

const server = new Server({ handler });
const listener = Deno.listen({ hostname: HOSTNAME, port: PORT });

Deno.addSignalListener("SIGTERM", () => {
  logger.info("Terminating HTTP server...");
  server.close();
});

logger.info(`Start listening ${HOSTNAME}:${PORT}...`);
await server.serve(listener);
