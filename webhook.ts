import { createBot, createEventHandlers } from "./deps.ts";

import { createLogger } from "./src/logger/mod.ts";
import { loadConfig } from "./src/config/mod.ts";
import { CommandManager } from "./src/command/mod.ts";

import { startServer } from "./src/webhook/mod.ts";

// Create logger instance with the default log level.
const logger = createLogger();

// Logging
// app.use(access_logging);

const { config, err } = loadConfig();
if (err) {
  logger.error("failed to load config from environment variables.", err);
  Deno.exit(1);
}

// Update the severity of the logging.
logger.setSeverity(config.logLevel);

// managers
const cmdMgr = new CommandManager(logger);
cmdMgr.init();

const bot = createBot({
  token: config.discordToken,
  intents: ["Guilds", "GuildMessages"],
  botId: config.discordBotId,
  events: createEventHandlers({}),
});

startServer(bot, {
  logger: logger,
  config: config,
  cmdMgr: cmdMgr,
});
