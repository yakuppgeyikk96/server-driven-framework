import { raw, SafeHtml } from "./html.ts";

export function widget(
  name: string,
  props?: unknown,
  fallback?: SafeHtml,
): SafeHtml {
  const data =
    props === undefined
      ? ""
      : `<script type="application/json" data-props>${JSON.stringify(props).replace(/</g, "\\u003c")}</script>`;
  return raw(`<div data-widget="${name}">${data}${fallback ? fallback.value : ""}</div>`);
}
