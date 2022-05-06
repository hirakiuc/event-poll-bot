import { createBot, sendMessage, startBot } from "./deps.ts";

import { Logger } from "./src/logger/mod.ts";
import { loadConfig } from "./src/config/mod.ts";

import type { Bot, Message } from "./deps.ts";

const logger = new Logger();

const { config, err } = loadConfig();
if (err) {
  logger.error({
    message: "failed to load config from environment variables.",
    error: logger.convertErr(err),
  });
  Deno.exit(1);
}

const bot = createBot({
  token: config.discordToken,
  intents: ["Guilds", "GuildMessages"],
  botId: config.discordBotId,
  events: {
    ready() {
      logger.info("Successfully connected to gateway");
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
