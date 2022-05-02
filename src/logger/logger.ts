// TODO: rewrite the current implementation by using deno's std/log.
// import * as log from "https://deno.land/std@0.137.0/log/mod.ts";
//
// Docs
// https://zenn.dev/kawarimidoll/articles/b1d9bc15aaa99c
// https://deno.land/std/log

// https://zenn.dev/moga/articles/cloudrun-structured-log
enum Severity {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  ALERT = "ALERT",
}

type Payload = {
  [key: string]: string | number | boolean | null | Payload[] | Payload;
};

class Logger {
  static debug(payload: Payload): void {
    Logger.log(Severity.DEBUG, payload);
  }

  static info(payload: Payload): void {
    Logger.log(Severity.INFO, payload);
  }

  static warning(payload: Payload, error?: Error): void {
    Logger.log(Severity.WARNING, payload, error);
  }

  static error(payload: Payload, error?: Error): void {
    Logger.log(Severity.ERROR, payload, error);
  }

  private static log(severity: Severity, payload: Payload, error?: Error) {
    const entry: Payload = {
      severity,
      ...payload,
    };

    if (error) {
      entry.error = {
        message: error.message,
        name: error.name,
      };

      if (error.stack) {
        entry.error.stack = error.stack;
      }
    }

    console.log(JSON.stringify(entry));
  }
}

export { Logger, Severity };
