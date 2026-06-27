import { type SafeHtml } from "./html.ts";

export interface Context {
  url: URL;
  params: Record<string, string>;
  query: URLSearchParams;
  data: Record<string, string>;
}

export interface Route {
  method: string;
  path: string;
  title: string;
  view: (ctx: Context) => SafeHtml | Promise<SafeHtml>;
}

export interface Match {
  route: Route;
  params: Record<string, string>;
}

export interface PageDef {
  title: string;
  view: (ctx: Context) => SafeHtml | Promise<SafeHtml>;
}

export type RouteMap = Record<string, PageDef>;

function page(
  path: string,
  title: string,
  view: (ctx: Context) => SafeHtml | Promise<SafeHtml>,
): Route {
  return { method: "GET", path, title, view };
}

export function buildRoutes(map: RouteMap): Route[] {
  return Object.entries(map).map(([path, def]) => page(path, def.title, def.view));
}

function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const segment = patternParts[i];
    if (segment.startsWith(":")) {
      params[segment.slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (segment !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export function matchRoute(routes: Route[], method: string, pathname: string): Match | null {
  for (const route of routes) {
    if (route.method !== method) continue;
    const params = matchPath(route.path, pathname);
    if (params) return { route, params };
  }
  return null;
}
