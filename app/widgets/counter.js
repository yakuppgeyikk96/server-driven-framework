import { signal, html, effect } from "framework/client";

export default function (props) {
  const count = signal(Number(props?.start) || 0);

  return html`
    <button class="button" onclick=${() => count.set((c) => c - 1)}>-</button>
    <strong> ${count} </strong>
    <button class="button" onclick=${() => count.set((c) => c + 1)}>+</button>
    ${() => (count() < 0 ? html`<em> negative!</em>` : null)}
  `;
}
