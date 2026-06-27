import { type Context } from "./router.ts";
import { type SafeHtml } from "./html.ts";

export type ActionHandler = (ctx: Context) => SafeHtml | Promise<SafeHtml>;

export interface Action {
  path: string;
  handler: ActionHandler;
}

const registry = new Map<string, Action>();
let counter = 0;

export function action(handler: ActionHandler): Action {
  const path = "/__sdf/action/a" + counter++;
  const entry: Action = { path, handler };
  registry.set(path, entry);
  return entry;
}

export function findAction(path: string): Action | undefined {
  return registry.get(path);
}
