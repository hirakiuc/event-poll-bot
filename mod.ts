import { createBot, startBot } from "./deps.ts";

import { createLogger } from "./src/logger/mod.ts";
import { loadConfig } from "./src/config/mod.ts";
import { eventHandlers } from "./src/event/handlers/mod.ts";

// Create logger instance with the default log level.
const logger = createLogger();

const { config, err } = loadConfig();
if (err) {
  logger.error("failed to load config from environment variables.", err);
  Deno.exit(1);
}
// Update the severity of the logging.
logger.setSeverity(config.logLevel);

const bot = createBot({
  token: config.discordToken,
  intents: ["Guilds", "GuildMessages"],
  botId: config.discordBotId,
  events: eventHandlers(logger),
});

await startBot(bot);
