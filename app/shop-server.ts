import {
  html,
  action,
  type SafeHtml,
  type Context,
} from "../framework/index.ts";
import { buildCatalog, type Product } from "./products.ts";

const ALL = buildCatalog(1000);
const CATEGORIES = ["All", ...new Set(ALL.map((p) => p.category))];
const PAGE_SIZE = 60;

function stars(rating: number): string {
  const filled = Math.round(rating);
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

function ProductCard(p: Product): SafeHtml {
  const badgeClass = p.badge
    ? "badge--" + p.badge.toLowerCase().replace(/\s+/g, "-")
    : "";
  return html`<article class="product">
    <div class="product__media">
      <span class="product__emoji">${p.image}</span>
      ${p.badge
        ? html`<span class="product__badge ${badgeClass}">${p.badge}</span>`
        : null}
    </div>
    <div class="product__body">
      <span class="product__category">${p.category}</span>
      <h3 class="product__name">${p.name}</h3>
      <span class="product__brand">${p.brand}</span>
      <div class="product__rating">
        <span class="product__stars" aria-hidden="true">${stars(p.rating)}</span>
        <span class="product__reviews"
          >${p.rating.toFixed(1)} (${p.reviews.toLocaleString("en-US")})</span
        >
      </div>
      <div class="product__price">
        <span class="product__amount">$${p.price.toFixed(2)}</span>
        ${p.oldPrice
          ? html`<span class="product__old">$${p.oldPrice.toFixed(2)}</span>`
          : null}
      </div>
      <button class="button product__add" ${p.inStock ? "" : "disabled"}>
        ${p.inStock ? "Add to cart" : "Out of stock"}
      </button>
    </div>
  </article>`;
}

function filterSort(data: Record<string, string>): Product[] {
  const q = (data.q ?? "").trim().toLowerCase();
  const cat = data.category ?? "All";
  const stock = data.stock != null;
  let out = ALL.filter((p) => {
    if (cat !== "All" && p.category !== cat) return false;
    if (stock && !p.inStock) return false;
    if (q && !`${p.name} ${p.brand}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const by = data.sort ?? "featured";
  if (by === "price-asc") out = out.slice().sort((a, b) => a.price - b.price);
  else if (by === "price-desc") out = out.slice().sort((a, b) => b.price - a.price);
  else if (by === "rating") out = out.slice().sort((a, b) => b.rating - a.rating);
  return out;
}

function results(list: Product[]): SafeHtml {
  const shown = list.slice(0, PAGE_SIZE);
  return html`<p class="shop__count">
      Showing ${shown.length} of ${list.length} matches
    </p>
    <div class="product-grid">${shown.map(ProductCard)}</div>`;
}

export const shopFilter = action((ctx: Context) =>
  results(filterSort(ctx.data)),
);

export function ShopServerPage(_ctx: Context): SafeHtml {
  return html`<h1>Shop — server-side</h1>
    <p class="shop__intro">
      Same catalog, but filtering and sorting run on the server. Each change
      posts the form and swaps in a freshly rendered grid — no client state, no
      widget, no signals. (Paginated to ${PAGE_SIZE}, as a server app would.)
    </p>
    <form
      class="shop__toolbar"
      data-action="${shopFilter.path}"
      data-target="#shop-server-results"
      data-swap="inner"
      data-trigger="input change submit"
    >
      <div class="shop__controls">
        <input
          class="shop__search"
          type="search"
          name="q"
          placeholder="Search products…"
        />
        <select class="shop__sort" name="category">
          ${CATEGORIES.map(
            (c) =>
              html`<option value="${c}">
                ${c === "All" ? "All categories" : c}
              </option>`,
          )}
        </select>
        <select class="shop__sort" name="sort">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
        <label class="shop__stock">
          <input type="checkbox" name="stock" />
          In stock only
        </label>
      </div>
    </form>
    <div id="shop-server-results">${results(filterSort({}))}</div>`;
}
