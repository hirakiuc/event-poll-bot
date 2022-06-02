import type {
  ApplicationCommandOption,
  Bot,
  Embed,
  Interaction,
  InteractionDataOption,
  InteractionResponse,
} from "../../../deps.ts";

import type { Executor, Loggable, SubCommand } from "../../../shared.ts";

import {
  ApplicationCommandOptionTypes,
  InteractionResponseTypes,
} from "../../../deps.ts";

const emojis: string[] = [
  "🇦", // :regional_indicator_a
  "🇧", // :regional_indicator_b
  "🇨", // :regional_indicator_c
  "🇩", // :regional_indicator_d
  "🇪", // :regional_indicator_e
];

class Candidate {
  label: string;
  emoji: string;

  constructor(label: string) {
    this.label = label;
    this.emoji = "";
  }

  validate(): boolean {
    return (this.label.length !== 0);
  }

  toString(): string {
    return `${this.emoji} ${this.label}`;
  }
}

class Arguments {
  title: string;
  candidates: Candidate[];

  constructor() {
    this.title = "";
    this.candidates = [];
  }

  validate(): boolean {
    if (this.title.length === 0) {
      return false;
    }

    if (this.candidates.length === 0) {
      return false;
    }

    for (const c of this.candidates) {
      if (!c.validate()) {
        return false;
      }
    }

    return true;
  }

  arrangeEmojis(): void {
    for (const [idx, candidate] of this.candidates.entries()) {
      const emoji_idx = (emojis.length > idx) ? idx : (emojis.length - 1);
      candidate.emoji = emojis[emoji_idx];
    }
  }

  getEmojis(): string[] {
    return this.candidates
      .map((v: Candidate) => v.emoji)
      .reduce<string[]>((acc, emoji) => {
        acc.push(emoji);
        return acc;
      }, []);
  }
}

// /event-poll start ...
const option: ApplicationCommandOption = {
  name: "start",
  description: "Start polling a schedule of an event.",
  type: ApplicationCommandOptionTypes.SubCommand,
  required: false,
  options: [
    {
      name: "title",
      description: "title of this poll",
      type: ApplicationCommandOptionTypes.String,
      required: true,
    },
    {
      name: "option1",
      description: "Candidate Event Time",
      type: ApplicationCommandOptionTypes.String,
      required: false,
    },
    {
      name: "option2",
      description: "Candidate Event Time",
      type: ApplicationCommandOptionTypes.String,
      required: false,
    },
    {
      name: "option3",
      description: "Candidate Event Time",
      type: ApplicationCommandOptionTypes.String,
      required: false,
    },
    {
      name: "option4",
      description: "Candidate Event Time",
      type: ApplicationCommandOptionTypes.String,
      required: false,
    },
    {
      name: "option5",
      description: "Candidate Event Time",
      type: ApplicationCommandOptionTypes.String,
      required: false,
    },
  ],
};

class EventPollStartCommand implements SubCommand {
  name: string;
  description: string;
  usage: string[];

  private bot: Bot;
  private logger: Loggable;

  constructor(bot: Bot, logger: Loggable) {
    this.name = "start";
    this.description = "start an event poll";
    this.usage = ["/event-poll start title option1..."];
    this.logger = logger;

    this.bot = bot;
  }

  getOption(): ApplicationCommandOption {
    return option;
  }

  getExecutor(
    interaction: Interaction,
    args: InteractionDataOption[],
  ): Executor | Error {
    return new EventPollStartExecutor(
      this,
      interaction,
      args,
      this.bot,
      this.logger,
    );
  }
}

class EventPollStartExecutor implements Executor {
  private subcmd: SubCommand;
  private interaction: Interaction;
  private options: InteractionDataOption[];
  private logger: Loggable;

  private args: Arguments;
  private bot: Bot;

  constructor(
    subcmd: SubCommand,
    interaction: Interaction,
    options: InteractionDataOption[],
    bot: Bot,
    logger: Loggable,
  ) {
    this.subcmd = subcmd;
    this.interaction = interaction;
    this.options = options;
    this.logger = logger;

    this.args = new Arguments();
    this.bot = bot;
  }

  beforeExec(): Promise<InteractionResponse | void | Error> {
    try {
      this.args = this.parseArguments(this.options);
    } catch (err) {
      this.logger.warn(`failed to parse options:${err.message}`);
      return Promise.reject(err);
    }

    return Promise.resolve();
  }

  execute(): Promise<InteractionResponse | void | Error> {
    return Promise.resolve({
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    });
  }

  async afterExec(): Promise<InteractionResponse | void | Error> {
    // wait for a little bit
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.logger.debug({
      message: "Invoke /event-poll start command",
      arguments: this.args,
    });

    try {
      await this.bot.helpers.editInteractionResponse(
        this.interaction.token,
        // https://doc.deno.land/https://deno.land/x/discordeno@13.0.0-rc42/mod.ts/~/EditWebhookMessage
        {
          content: "Polling an event schedule...",
          embeds: this.transformArgumentsToEmbeds(this.args),
        },
      );

      // Fetch the interaction response sent by above code.
      const res = await this.bot.helpers.getOriginalInteractionResponse(
        this.interaction.token,
      );

      // Add reactions
      await this.bot.helpers.addReactions(
        this.interaction.channelId!,
        res.id,
        this.args.getEmojis(),
        true,
      );
    } catch (err) {
      this.logger.error("failed to respond to a interaction request", err);
      return Promise.reject(err);
    }

    return Promise.resolve();
  }

  private parseArguments(args: InteractionDataOption[]): Arguments {
    if (args.length === 0) {
      throw new Deno.errors.InvalidData("Invalid request:No arguments");
    }

    const result = new Arguments();

    for (const arg of args) {
      if (arg.name === "title") {
        if (arg.value) {
          result.title = arg.value as string;
        }

        continue;
      }

      if (arg.name.startsWith("option")) {
        if (arg.value && arg.type === ApplicationCommandOptionTypes.String) {
          result.candidates.push(
            new Candidate(arg.value as string),
          );
        }

        continue;
      }
    }

    return result;
  }

  private transformArgumentsToEmbeds(args: Arguments): Embed[] {
    args.arrangeEmojis();
    const labels = args.candidates.map((v) => v.toString());

    return [
      {
        type: "rich",
        title: args.title,
        description: [
          "What do you think...? <:pduck_thinking_face:934076458874327053>",
          "",
          ...labels,
        ].join("\n"),
        color: 0x2a2adf,
      },
    ];
  }
}

const createEventPollStartCmd = (bot: Bot, logger: Loggable): SubCommand => {
  return new EventPollStartCommand(bot, logger);
};

export { createEventPollStartCmd };
