import type { ApplicationCommandOption } from "../../../deps.ts";
import { ApplicationCommandOptionTypes } from "../../../deps.ts";

const usage = "/event-poll stop id";

// /event-poll stop ...
const options: ApplicationCommandOption[] = [
  {
    name: "stop",
    description: "Stop a poll with a poll id",
    type: ApplicationCommandOptionTypes.SubCommand,
    required: true,
    options: [
      {
        name: "id",
        description: "poll id",
        type: ApplicationCommandOptionTypes.Number,
        required: true,
      },
    ],
  },
];

export { options, usage };
