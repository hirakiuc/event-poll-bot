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

const replacer = (_key: unknown, value: unknown): unknown => {
  switch (typeof value) {
    case "bigint":
      return value.toString();
    default:
      return value;
  }
};

class Logger {
  // debug methods
  debug(msg: string): void;
  debug(...payloads: Record<string, unknown>[]): void;
  debug(payload: unknown): void {
    this.log(Severity.DEBUG, payload);
  }

  // info methods
  info(msg: string): void;
  info(...payloads: Record<string, unknown>[]): void;
  info(payload: unknown): void {
    this.log(Severity.INFO, payload);
  }

  // warning methods
  warn(msg: string): void;
  warn(...payloads: Record<string, unknown>[]): void;
  warn(payload: unknown): void {
    this.log(Severity.WARNING, payload);
  }

  // error methods
  error(payload: string, err?: Error): void;
  error(...payload: Record<string, unknown>[]): void;
  error(payload: unknown): void {
    // NOTE: a hack to fetch the hidden 2nd argument.
    const err = (arguments.length > 1) ? arguments[1] as Error : undefined;

    this.log(Severity.ERROR, payload, err);
  }

  convertErr(err: Error): Record<string, unknown> {
    return {
      message: err.message,
      name: err.name,
      stack: (err.stack) ? err.stack : "",
    };
  }

  private log(severity: Severity, payload: unknown, err?: Error): void {
    const records: Record<string, unknown>[] = [];

    switch (typeof payload) {
      case "string":
        records.push({ message: payload });
        break;
      case "object":
        if (Array.isArray(payload)) {
          for (const v of payload as Record<string, unknown>[]) {
            records.push(v);
          }
        } else {
          records.push(payload as Record<string, unknown>);
        }

        break;
      default:
        records.push({ log: payload });
    }

    if (err) {
      records.push({ error: this.convertErr(err) });
    }

    const entry: Record<string, unknown> = { severity };
    for (const [key, value] of Object.entries(records)) {
      entry[key] = value;
    }

    // NOTE: Need to use replacer argument due to parse any BigInt values
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
    console.log(JSON.stringify(entry, replacer));
  }
}

export { Logger, Severity };
