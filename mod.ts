import { createBot } from "./deps.ts";

import { createLogger } from "./src/logger/mod.ts";
import { loadConfig } from "./src/config/mod.ts";
import { CommandManager } from "./src/command/mod.ts";

import { createServer } from "./src/webhook/mod.ts";

const PORT = 8000;

// Create logger instance with the default log level.
const logger = createLogger();

const { config, err } = loadConfig();
if (err) {
  logger.error("failed to load config from environment variables.", err);
  Deno.exit(1);
}
// Update the severity of the logging.
logger.setSeverity(config.logLevel);

const bot = await createBot({
  token: config.discordToken,
  botId: config.discordBotId,
});

// managers
const cmdMgr = new CommandManager(logger);
cmdMgr.init(bot, config);

const server = createServer({
  logger: logger,
  config: config,
  cmdMgr: cmdMgr,
});

const abortCtrl = new AbortController();
const { signal } = abortCtrl;

server.addEventListener(
  "listen",
  (_e) => logger.info("Listening on 8000 port"),
);

await server.listen({ port: PORT, signal: signal });
logger.info("Server closed.");
