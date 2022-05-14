// TODO: rewrite the current implementation by using deno's std/log.
// import * as log from "https://deno.land/std@0.137.0/log/mod.ts";
//
// Docs
// https://zenn.dev/kawarimidoll/articles/b1d9bc15aaa99c
// https://deno.land/std/log

// https://zenn.dev/moga/articles/cloudrun-structured-log

const Severity = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARNING: "WARNING",
  ERROR: "ERROR",
  ALERT: "ALERT",
};

// Type definition of the Severity (each string value of the property of the Severity constant)
type Severity = typeof Severity[keyof typeof Severity];

const SeverityValue = {
  NONE: 0,
  DEBUG: 1,
  INFO: 2,
  WARNING: 3,
  ERROR: 4,
  ALERT: 5,
};

// Type definition of the SeverityValue (each string value of the property of the SeverityValue constant)
type SeverityValue = typeof SeverityValue[keyof typeof SeverityValue];

const severityToValue = (severity: Severity): SeverityValue => {
  switch (severity) {
    case Severity.DEBUG:
      return SeverityValue.DEBUG;
    case Severity.INFO:
      return SeverityValue.INFO;
    case Severity.WARNING:
      return SeverityValue.WARNING;
    case Severity.ERROR:
      return SeverityValue.ERROR;
    case Severity.ALERT:
      return SeverityValue.ALERT;
    default:
      return SeverityValue.NONE;
  }
};

const replacer = (_key: unknown, value: unknown): unknown => {
  switch (typeof value) {
    case "bigint":
      return value.toString();
    default:
      return value;
  }
};

class Logger {
  private severityValue: SeverityValue;

  constructor(sev: Severity) {
    this.severityValue = severityToValue(sev);
  }

  setSeverity(sev: Severity): void {
    this.severityValue = severityToValue(sev);
  }

  // debug methods
  debug(msg: string): void;
  debug(...payloads: Record<string, unknown>[]): void;
  debug(payload: unknown): void {
    if (!this.shouldLog(Severity.DEBUG)) {
      return;
    }

    this.log(Severity.DEBUG, payload);
  }

  // info methods
  info(msg: string): void;
  info(...payloads: Record<string, unknown>[]): void;
  info(payload: unknown): void {
    if (!this.shouldLog(Severity.INFO)) {
      return;
    }

    this.log(Severity.INFO, payload);
  }

  // warning methods
  warn(msg: string): void;
  warn(...payloads: Record<string, unknown>[]): void;
  warn(payload: unknown): void {
    if (!this.shouldLog(Severity.WARNING)) {
      return;
    }

    this.log(Severity.WARNING, payload);
  }

  // error methods
  error(payload: string, err?: Error): void;
  error(...payload: Record<string, unknown>[]): void;
  error(payload: unknown): void {
    if (!this.shouldLog(Severity.ERROR)) {
      return;
    }

    // NOTE: a hack to fetch the hidden 2nd argument.
    const err = (arguments.length > 1) ? arguments[1] as Error : undefined;

    this.log(Severity.ERROR, payload, err);
  }

  private shouldLog(severity: Severity): boolean {
    const v = severityToValue(severity);
    return (this.severityValue <= v);
  }

  private convertErr(err: Error): Record<string, unknown> {
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

const createLogger = (sev: Severity | void): Logger => {
  const v = (sev) ? sev : Severity.DEBUG;
  return new Logger(v);
};

export { createLogger };
export type { Severity };
