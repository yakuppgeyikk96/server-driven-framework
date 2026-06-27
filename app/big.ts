import { html, type SafeHtml, type Context, action } from "../framework/index.ts";
import { Button } from "./components.ts";

interface Post {
  id: number;
  title: string;
  body: string;
}

export const loadPosts = action(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts: Post[] = await res.json();
  return PostList(posts.slice(0, 20));
});

function PostList(posts: Post[]): SafeHtml {
  return html`<ul class="posts">
    ${posts.map(
      (post) => html`<li>
        <strong>${post.title}</strong>
        <p>${post.body}</p>
      </li>`,
    )}
  </ul>`;
}

export function BigPage(ctx: Context): SafeHtml {
  const requested = Number(ctx.query.get("n") ?? 1000) || 1000;
  const n = Math.min(Math.max(requested, 1), 100000);

  const rows: SafeHtml[] = [];
  for (let i = 0; i < n; i++) {
    rows.push(html`<tr>
      <td>${i}</td>
      <td>Item ${i}</td>
      <td>${(i * 7) % 100}</td>
    </tr>`);
  }

  return html`<h1>Big page</h1>

    <h2>Live data from an API</h2>
    <p>This action runs on the server, fetches JSONPlaceholder, returns HTML.</p>
    ${Button({ label: "Load posts", on: loadPosts, target: "#posts" })}
    <div id="posts"></div>

    <h2>Synthetic table (${n} rows)</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;
}
