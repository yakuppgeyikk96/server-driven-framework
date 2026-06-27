import { html, type SafeHtml, action } from "../framework/index.ts";
import { Button } from "./components.ts";

let count = 0;

export const increment = action(() => {
  count++;
  return counterBody();
});

function counterBody(): SafeHtml {
  return html`<p>Count: ${count}</p>
    ${Button({ label: "+1", on: increment, target: "#counter" })}`;
}

export function Counter(): SafeHtml {
  return html`<div id="counter">${counterBody()}</div>`;
}
