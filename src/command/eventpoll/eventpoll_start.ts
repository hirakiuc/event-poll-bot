import type { ApplicationCommandOption } from "../../../deps.ts";
import { ApplicationCommandOptionTypes } from "../../../deps.ts";

const usage = "/event-poll start title option1...";

// /event-poll start ...
const options: ApplicationCommandOption[] = [
  {
    name: "start",
    description: "Start polling a schedule of an event.",
    type: ApplicationCommandOptionTypes.SubCommand,
    required: true,
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
  },
];

export { options, usage };
