import { createBot, startBot, stopBot } from "./deps.ts";

import { createLogger } from "./src/logger/mod.ts";
import { loadConfig } from "./src/config/mod.ts";
import { eventHandlers } from "./src/event/mod.ts";
import { CommandManager } from "./src/command/mod.ts";

//-----
// To run this bot on Cloud Run, we need a web server to respond health checks from gcp.
// For this purpose, this code starts a web server.
const cmd = ["deno", "run", "--allow-net", "--allow-env", "./server.ts"];
// Start a subprocess for the healthcheck
const server = Deno.run({ cmd });
//-----

// Create logger instance with the default log level.
const logger = createLogger();

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
  events: eventHandlers({ logger, config, cmdMgr }),
});

Deno.addSignalListener("SIGTERM", () => {
  return Promise.all([
    new Promise(() => {
      // Send the same signal to the subprocess for terminating it.
      server.kill("SIGTERM");
      return server.status()
        .then(() => logger.info("Terminated the web process."));
    }),
    new Promise(() => {
      logger.info("Terminating the Bot process...");
      return stopBot(bot)
        .then(() => logger.info("Terminated bot process."));
    }),
  ]);
});

await startBot(bot);
