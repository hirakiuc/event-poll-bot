import type { Severity } from "./logger.ts";
import { createLogger } from "./logger.ts";

interface Loggable {
  setSeverity(sev: Severity): void;

  // debug
  debug(msg: string): void;
  debug(...payloads: Record<string, unknown>[]): void;
  debug(payload: unknown): void;

  // info
  info(msg: string): void;
  info(...payloads: Record<string, unknown>[]): void;
  info(payload: unknown): void;

  // warning
  warn(msg: string): void;
  warn(...payloads: Record<string, unknown>[]): void;
  warn(payload: unknown): void;

  // error
  error(payload: string, err?: Error): void;
  error(...payload: Record<string, unknown>[]): void;
  error(payload: unknown): void;
}

export { createLogger };
export type { Loggable };
