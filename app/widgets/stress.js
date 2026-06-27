import { signal, html, list } from "framework/client";

export default function () {
  let nextId = 1;
  const make = (n) =>
    Array.from({ length: n }, () => ({ id: nextId++, value: 0 }));

  const items = signal(make(10));
  const timing = signal("ready");

  function measure(label, fn) {
    const start = performance.now();
    fn();
    const ms = performance.now() - start;
    timing.set(`${label}: ${ms.toFixed(1)} ms  (${items().length} rows)`);
  }

  function updateOne() {
    measure("update ONE (middle)", () => {
      const arr = items().slice();
      const i = Math.floor(arr.length / 2);
      arr[i] = { ...arr[i], value: arr[i].value + 1 };
      items.set(arr);
    });
  }

  function updateAll() {
    measure("update ALL", () =>
      items.set(items().map((it) => ({ ...it, value: it.value + 1 }))),
    );
  }

  function addOne() {
    measure("add one", () =>
      items.set([...items(), { id: nextId++, value: 0 }]),
    );
  }

  function removeOne() {
    measure("remove one", () => items.set(items().slice(0, -1)));
  }

  function rebuild(n) {
    measure(`rebuild ${n}`, () => items.set(make(n)));
  }

  function profile() {
    const N = 2000;
    const best = (run) => {
      let min = Infinity;
      for (let r = 0; r < 3; r++) {
        const start = performance.now();
        run();
        min = Math.min(min, performance.now() - start);
      }
      return min.toFixed(0);
    };

    const tpl = document.createElement("template");
    tpl.innerHTML = "<li>row 0 — value 0</li>";

    const htmlPath = best(() => {
      const f = document.createDocumentFragment();
      for (let i = 0; i < N; i++)
        f.appendChild(html`<li>row ${i} — value 0</li>`);
    });
    const createEl = best(() => {
      const f = document.createDocumentFragment();
      for (let i = 0; i < N; i++) {
        const li = document.createElement("li");
        li.textContent = "row " + i + " — value 0";
        f.appendChild(li);
      }
    });
    const cloneOnly = best(() => {
      const f = document.createDocumentFragment();
      for (let i = 0; i < N; i++) f.appendChild(tpl.content.cloneNode(true));
    });

    timing.set(
      `${N} ×3 best — html ${htmlPath}ms · createEl ${createEl}ms · cloneOnly ${cloneOnly}ms`,
    );
  }

  return html`
    <div>
      <button class="button" onclick=${updateOne}>Update ONE (middle)</button>
      <button class="button" onclick=${updateAll}>Update ALL</button>
      <button class="button" onclick=${addOne}>Add</button>
      <button class="button" onclick=${removeOne}>Remove</button>
      <button class="button" onclick=${() => rebuild(1000)}>Rebuild 1k</button>
      <button class="button" onclick=${() => rebuild(5000)}>Rebuild 5k</button>
      <button class="button" onclick=${profile}>Profile create 5k</button>
    </div>
    <p><strong>${timing}</strong></p>
    <ul>
      ${list(
        items,
        (it) => it.id,
        (it) => html`<li>row ${it.id} — value ${it.value}</li>`,
      )}
    </ul>
  `;
}
