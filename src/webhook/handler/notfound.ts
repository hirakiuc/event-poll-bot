import type { Bot, Handler } from "../../../deps.ts";
import type { HandlerOptions } from "../../../shared.ts";

import { json } from "../../../deps.ts";

const createNotFoundHandler = (_bot: Bot, _opts: HandlerOptions): Handler => {
  return (_request: Request): Response => {
    return json({ error: "Not found" }, { status: 404 });
  };
};

export { createNotFoundHandler };
