const KeyDiscordToken = "DISCORD_TOKEN";
const KeyDiscordBotId = "DISCORD_BOT_ID";
const KeyLogLevel = "LOG_LEVEL";
const KeyDiscordBotPublicKey = "DISCORD_BOT_PUBLIC_KEY";

// https://www.typescriptlang.org/docs/handbook/2/classes.html#index-signatures
class ConfigMap {
  [s: string]: string | undefined
}

class Config {
  private map: ConfigMap;

  constructor() {
    this.map = new ConfigMap();
  }

  load(): Error | void {
    const keys = [
      KeyDiscordToken,
      KeyDiscordBotId,
      KeyDiscordBotPublicKey,
      KeyLogLevel,
    ];

    for (const key of keys) {
      const { value, err } = this.loadEnvVar(key);
      if (err) {
        return err;
      }

      this.map[key] = value;
    }
  }

  get discordToken(): string {
    const v = this.map[KeyDiscordToken];
    return (v) ? v : "";
  }

  get discordBotId(): bigint {
    const v = this.map[KeyDiscordBotId];
    const str = (v) ? v : "";
    return BigInt(str);
  }

  get discordBotPublicKey(): string {
    const v = this.map[KeyDiscordBotPublicKey];
    return (v) ? v : "";
  }

  get logLevel(): string {
    const v = this.map[KeyLogLevel];
    return (v) ? v : "DEBUG";
  }

  private loadEnvVar(key: string): { value: string; err?: Error } {
    const v = Deno.env.get(key) as string;
    if (!v) {
      return {
        value: "",
        err: new Error(`Missing ${key} in environment variables.`),
      };
    }

    return { value: v };
  }
}

const loadConfig = (): { config: Config; err?: Error } => {
  const c = new Config();

  const err = c.load();
  if (err) {
    return {
      config: c,
      err: err,
    };
  }

  return { config: c };
};

export { loadConfig };
