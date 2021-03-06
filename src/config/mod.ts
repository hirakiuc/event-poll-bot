import { loadConfig } from "./config.ts";

export interface Config {
  load: () => Error | void;

  readonly discordToken: string;
  readonly discordBotId: bigint;
}

export { loadConfig };
