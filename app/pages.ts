import { html, type SafeHtml, type Context } from "../framework/index.ts";
import {
  Button,
  Card,
  SearchInput,
  CounterWidget,
  TodoWidget,
  StressWidget,
} from "./components.ts";
import { Counter } from "./counter.ts";
import { search, SearchResults } from "./search.ts";
export { BigPage } from "./big.ts";
export { ProductsPage } from "./products.ts";

export function HomePage(_ctx: Context): SafeHtml {
  return html`<h1>Home</h1>
    ${Card({
      title: "Welcome",
      children: html`<p>This card was composed from smaller components.</p>
        ${Button({ label: "Say hello", href: "/greet/Yakup" })}`,
    })}`;
}

export function AboutPage(_ctx: Context): SafeHtml {
  return html`<h1>About</h1>
    <p>Pages are just components that take a context and return HTML.</p>`;
}

export function GreetPage(ctx: Context): SafeHtml {
  const name = ctx.params.name ?? "stranger";
  return html`<h1>Hello, ${name}</h1>
    <p>This name came from the path, via ctx.params.</p>`;
}

export function CounterPage(_ctx: Context): SafeHtml {
  return html`<h1>Counter</h1>
    <p>Click +1: the server updates state and swaps only this fragment.</p>
    ${Counter()}`;
}

export function SearchPage(_ctx: Context): SafeHtml {
  return html`<h1>Search</h1>
    <p>
      Type to filter — each keystroke runs an action and swaps only the results.
    </p>
    ${SearchInput({
      on: search,
      target: "#results",
      name: "q",
      placeholder: "Search fruit...",
    })}
    <div id="results">${SearchResults()}</div>`;
}

export function WidgetsPage(_ctx: Context): SafeHtml {
  console.log("Widget Pages");
  return html`<h1>Widgets</h1>
    <p>
      These run entirely in the browser via signals — no server round-trip, no
      rerender. Their JS loads only on this page.
    </p>
    <h2>Counter</h2>
    ${CounterWidget({ start: 0 })}
    <h2>To-do (two-way input + reactive list)</h2>
    ${TodoWidget()}`;
}

export function StressPage(_ctx: Context): SafeHtml {
  return html`<h1>Reactive stress test</h1>
    <p>
      Watch the timing: "Update ONE" changes a single row, but the coarse list
      re-render rebuilds the whole list — so it costs about the same as "Update
      ALL". That's the bottleneck we want to fix.
    </p>
    ${StressWidget()}`;
}

export function NotFoundPage(_ctx: Context): SafeHtml {
  return html`<h1>404</h1>
    <p>No route matched this URL.</p>`;
}
