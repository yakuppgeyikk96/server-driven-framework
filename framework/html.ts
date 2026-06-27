export class SafeHtml {
  readonly strings: readonly string[] | null;
  readonly values: readonly unknown[];
  readonly precomputed: string | null;
  #cached: string | null = null;

  constructor(
    strings: readonly string[] | null,
    values: readonly unknown[],
    precomputed: string | null = null,
  ) {
    this.strings = strings;
    this.values = values;
    this.precomputed = precomputed;
  }

  get value(): string {
    if (this.#cached === null) {
      this.#cached =
        this.precomputed !== null
          ? this.precomputed
          : renderTemplate(this.strings ?? [""], this.values);
    }
    return this.#cached;
  }
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

function resolve(value: unknown): string {
  if (value === null || value === undefined || value === false) return "";
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(resolve).join("");
  if (typeof value === "function") return resolve(value());
  return escapeHtml(String(value));
}

function renderTemplate(strings: readonly string[], values: readonly unknown[]): string {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) {
    out += resolve(values[i]) + strings[i + 1];
  }
  return out;
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): SafeHtml {
  return new SafeHtml(strings, values);
}

export function raw(value: string): SafeHtml {
  return new SafeHtml(null, [], value);
}
