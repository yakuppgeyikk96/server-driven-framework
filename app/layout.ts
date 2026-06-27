import { html, type SafeHtml } from "../framework/index.ts";
import { Nav } from "./components.ts";

export function Layout(props: { title: string; children: SafeHtml }): SafeHtml {
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${props.title}</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        ${Nav()}
        <main id="app">${props.children}</main>
      </body>
    </html>`;
}
