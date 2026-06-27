import { html, type SafeHtml, type Context, action } from "../framework/index.ts";

const FRUITS = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "lemon", "mango"];

function results(query: string): SafeHtml {
  const q = query.trim().toLowerCase();
  const matches = q ? FRUITS.filter((fruit) => fruit.includes(q)) : FRUITS;
  if (matches.length === 0) return html`<p>No matches for "${query}".</p>`;
  return html`<ul>
    ${matches.map((fruit) => html`<li>${fruit}</li>`)}
  </ul>`;
}

export const search = action((ctx: Context) => results(ctx.data.q ?? ""));

export function SearchResults(): SafeHtml {
  return results("");
}
