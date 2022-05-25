import type {
  ApplicationCommandOption,
  Bot,
  Embed,
  Interaction,
} from "../../../deps.ts";
import type {
  Loggable,
  SubCommand,
  SubCommandArgument,
} from "../../../shared.ts";

import {
  ApplicationCommandOptionTypes,
  InteractionResponseTypes,
} from "../../../deps.ts";

import { AbstractSubCommand } from "../../../shared.ts";

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

class EventPollStartCommand extends AbstractSubCommand {
  constructor(logger: Loggable) {
    super({
      name: "start",
      description: "start an event poll",
      usage: ["/event-poll start title option1..."],
    }, logger);
  }

  getOption(): ApplicationCommandOption {
    return option;
  }

  async execute(
    bot: Bot,
    interaction: Interaction,
    args: SubCommandArgument[],
  ): Promise<Error | void> {
    this.logger.debug({
      message: "Invoke /event-poll start command",
      arguments: args,
    });

    try {
      const values = this.parseArguments(args);

      await bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        // https://doc.deno.land/https://deno.land/x/discordeno@13.0.0-rc35/mod.ts/~/InteractionResponse
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          // https://doc.deno.land/https://deno.land/x/discordeno@13.0.0-rc35/mod.ts/~/InteractionApplicationCommandCallbackData
          data: {
            content: "Polling an event schedule...",
            tts: false,
            embeds: this.transformArgumentsToEmbeds(values),
          },
        },
      );

      // Fetch the interaction response sent by above code.
      const res = await bot.helpers.getOriginalInteractionResponse(
        interaction.token,
      );

      // Add reactions
      await bot.helpers.addReactions(
        interaction.channelId!,
        res.id,
        values.getEmojis(),
        true,
      );
    } catch (err) {
      this.logger.error("failed to respond to a interaction request", err);
      return Promise.reject(err);
    }

    return Promise.resolve();
  }

  private parseArguments(args: SubCommandArgument[]): Arguments {
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

const createEventPollStartCmd = (logger: Loggable): SubCommand => {
  return new EventPollStartCommand(logger);
};

export { createEventPollStartCmd };
