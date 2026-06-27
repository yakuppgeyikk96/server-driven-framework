import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
  type Server,
} from "node:http";
import { resolve } from "node:path";
import {
  matchRoute,
  buildRoutes,
  type Context,
  type RouteMap,
} from "./router.ts";
import { readStaticFile } from "./static.ts";
import { findAction } from "./actions.ts";
import { type SafeHtml } from "./html.ts";

export interface AppOptions {
  routes: RouteMap;
  layout: (ctx: Context, title: string, body: SafeHtml) => SafeHtml;
  notFound: (ctx: Context) => SafeHtml;
  static?: string;
  widgets?: string;
}

async function serveStatic(
  res: ServerResponse,
  root: string,
  pathname: string,
): Promise<boolean> {
  const file = await readStaticFile(root, pathname);
  if (!file) return false;
  res.writeHead(200, {
    "Content-Type": file.contentType,
    "Cache-Control": "public, max-age=60",
  });
  res.end(file.body);
  return true;
}

function sendFragment(
  res: ServerResponse,
  status: number,
  title: string,
  body: SafeHtml,
) {
  res.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "X-SDF-Title": encodeURIComponent(title),
  });
  res.end(body.value);
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

function parseForm(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(raw)) out[key] = value;
  return out;
}

export function createApp(options: AppOptions): Server {
  const routes = buildRoutes(options.routes);
  const routePatterns = routes.map((route) => route.path);
  const clientRoot = resolve(import.meta.dirname, "client");
  const staticRoot = options.static ? resolve(options.static) : null;
  const widgetsRoot = options.widgets ? resolve(options.widgets) : null;

  const manifestJson = JSON.stringify(routePatterns).replace(/</g, "\\u003c");
  const bootScript =
    `<script>window.__SDF_ROUTES__=${manifestJson}</script>` +
    `<script type="importmap">{"imports":{"framework/client":"/__sdf/index.js"}}</script>` +
    `<script src="/__sdf/runtime.js" defer></script>`;

  function sendPage(res: ServerResponse, status: number, node: SafeHtml) {
    const out = node.value.replace("</head>", bootScript + "</head>");
    res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
    res.end(out);
  }

  async function handle(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url ?? "/", "http://localhost");
    const method = req.method ?? "GET";
    const isFragment = req.headers["x-sdf-fragment"] === "1";

    if (method === "GET" || method === "HEAD") {
      if (url.pathname.startsWith("/__sdf/")) {
        if (await serveStatic(res, clientRoot, url.pathname.slice(6))) return;
      } else if (widgetsRoot && url.pathname.startsWith("/widgets/")) {
        if (await serveStatic(res, widgetsRoot, url.pathname.slice(8))) return;
      } else if (staticRoot) {
        if (await serveStatic(res, staticRoot, url.pathname)) return;
      }
    }

    if (method === "POST" && url.pathname.startsWith("/__sdf/action/")) {
      const found = findAction(url.pathname);
      if (found) {
        const data = parseForm(await readBody(req));
        const ctx: Context = { url, params: {}, query: url.searchParams, data };
        try {
          const body = await found.handler(ctx);
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(body.value);
        } catch (error) {
          res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<p>Action failed.</p>");
          console.error("action error:", error);
        }
        return;
      }
    }

    const match = matchRoute(routes, method, url.pathname);

    if (!match) {
      const ctx: Context = { url, params: {}, query: url.searchParams, data: {} };
      const body = options.notFound(ctx);
      if (isFragment) return sendFragment(res, 404, "Not Found", body);
      return sendPage(res, 404, options.layout(ctx, "Not Found", body));
    }

    const ctx: Context = {
      url,
      params: match.params,
      query: url.searchParams,
      data: {},
    };
    const body = await match.route.view(ctx);
    if (isFragment) return sendFragment(res, 200, match.route.title, body);
    return sendPage(res, 200, options.layout(ctx, match.route.title, body));
  }

  return createServer(handle);
}
