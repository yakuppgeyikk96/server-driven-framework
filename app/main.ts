import { createApp } from "../framework/index.ts";
import { routes } from "./routes.ts";
import { Layout } from "./layout.ts";
import { NotFoundPage } from "./pages.ts";

const app = createApp({
  routes,
  layout: (_ctx, title, body) => Layout({ title, children: body }),
  notFound: (ctx) => NotFoundPage(ctx),
  static: "public",
  widgets: "app/widgets",
});

app.listen(3000, () => {
  console.log("→ listening on http://localhost:3000");
});
