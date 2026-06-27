import { readFile, stat } from "node:fs/promises";
import { join, normalize, extname, sep } from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

export interface StaticFile {
  contentType: string;
  body: Buffer;
}

export async function readStaticFile(root: string, pathname: string): Promise<StaticFile | null> {
  const filePath = normalize(join(root, pathname));
  if (filePath !== root && !filePath.startsWith(root + sep)) return null;

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return null;
    const body = await readFile(filePath);
    const contentType = CONTENT_TYPES[extname(filePath)] ?? "application/octet-stream";
    return { contentType, body };
  } catch {
    return null;
  }
}
