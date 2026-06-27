import { signal, html } from "framework/client";

export default function () {
  const todos = signal([]);
  const draft = signal("");
  let nextId = 1;

  function add(event) {
    event.preventDefault();
    const text = draft().trim();
    if (!text) return;
    todos.set([...todos(), { id: nextId++, text }]);
    draft.set("");
  }

  function remove(id) {
    todos.set(todos().filter((todo) => todo.id !== id));
  }

  return html`
    <form onsubmit=${add}>
      <input
        value=${draft}
        oninput=${(e) => draft.set(e.target.value)}
        placeholder="New todo"
      />
      <button class="button" type="submit">Add</button>
    </form>

    ${() => (todos().length === 0 ? html`<p>No todos yet.</p>` : null)}

    <ul>
      ${() =>
        todos().map(
          (todo) =>
            html`<li>
              ${todo.text}
              <button onclick=${() => remove(todo.id)}>×</button>
            </li>`,
        )}
    </ul>
  `;
}
