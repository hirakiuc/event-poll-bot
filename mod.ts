import { createBot, sendMessage, startBot } from "./deps.ts";

import { createLogger } from "./src/logger/mod.ts";
import { loadConfig } from "./src/config/mod.ts";

import type { Bot, Message } from "./deps.ts";

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
  events: {
    ready() {
      logger.info("Successfully connected to Discord!");
    },
    messageCreate(bot: Bot, message: Message) {
      logger.debug({ message });

      // Process the message with your command handler here
      if (message.content == "Hello") {
        sendMessage(bot, message.channelId, {
          content: "Hi!",
        });
      } else {
        console.log("Ignore it.");
      }
    },
  },
});

await startBot(bot);
