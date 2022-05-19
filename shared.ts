// Internal shared types
import type { Loggable } from "./src/logger/mod.ts";
import type { Config } from "./src/config/mod.ts";
import { CommandManager } from "./src/command/commander.ts";

interface HandlerOptions {
  logger: Loggable;
  config: Config;
  cmdMgr: CommandManager;
}

export type { HandlerOptions };
