import { html, type SafeHtml, type Action } from "../framework/index.ts";

export function Nav(): SafeHtml {
  return html`<nav>
    <a href="/">Home</a> · <a href="/shop">Shop</a> ·
    <a href="/about">About</a> ·
    <a href="/greet/Yakup">Greet</a> · <a href="/counter">Counter</a> ·
    <a href="/search">Search</a> · <a href="/big">Big</a> ·
    <a href="/widgets">Widgets</a> ·
    <a href="/stress">Stress</a>
  </nav>`;
}

export function Button(props: {
  label: string;
  href?: string;
  on?: Action;
  target?: string;
  swap?: string;
}): SafeHtml {
  if (props.on) {
    return html`<button
      class="button"
      data-action="${props.on.path}"
      data-target="${props.target ?? ""}"
      data-swap="${props.swap ?? "inner"}"
    >
      ${props.label}
    </button>`;
  }
  return html`<a class="button" href="${props.href ?? "#"}">${props.label}</a>`;
}

export function SearchInput(props: {
  on: Action;
  target: string;
  name?: string;
  placeholder?: string;
}): SafeHtml {
  return html`<input
    type="search"
    name="${props.name ?? "q"}"
    placeholder="${props.placeholder ?? ""}"
    data-action="${props.on.path}"
    data-target="${props.target}"
    data-trigger="input"
  />`;
}

export function Card(props: { title: string; children: SafeHtml }): SafeHtml {
  return html`<section class="card">
    <h2>${props.title}</h2>
    ${props.children}
  </section>`;
}

export function CounterWidget(props: { start?: number }): SafeHtml {
  const start = props.start ?? 0;
  return html`<div
    class="card"
    data-widget="counter"
    data-start="${start}"
  ></div>`;
}

export function TodoWidget(): SafeHtml {
  return html`<div class="card" data-widget="todo">
    <p>Interactive to-do (needs JS).</p>
  </div>`;
}

export function StressWidget(): SafeHtml {
  return html`<div class="card" data-widget="stress">
    <p>Loading stress test…</p>
  </div>`;
}
