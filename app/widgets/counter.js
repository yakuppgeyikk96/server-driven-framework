import { signal, html, effect } from "framework/client";

export default function (el) {
  const count = signal(Number(el.dataset.start) || 0);

  return html`
    <button class="button" onclick=${() => count.set((c) => c - 1)}>-</button>
    <strong> ${count} </strong>
    <button class="button" onclick=${() => count.set((c) => c + 1)}>+</button>
    ${() => (count() < 0 ? html`<em> negative!</em>` : null)}
  `;
}
