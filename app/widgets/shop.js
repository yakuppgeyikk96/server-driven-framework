import { signal, html, list } from "framework/client";

const stars = (r) =>
  "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

function card(p) {
  const badgeClass = p.badge
    ? "badge--" + p.badge.toLowerCase().replace(/\s+/g, "-")
    : "";
  return html`<article class="product">
    <div class="product__media">
      <span class="product__emoji">${p.image}</span>
      ${p.badge
        ? html`<span class=${"product__badge " + badgeClass}>${p.badge}</span>`
        : null}
    </div>
    <div class="product__body">
      <span class="product__category">${p.category}</span>
      <h3 class="product__name">${p.name}</h3>
      <span class="product__brand">${p.brand}</span>
      <div class="product__rating">
        <span class="product__stars">${stars(p.rating)}</span>
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
      <button class="button product__add" disabled=${!p.inStock}>
        ${p.inStock ? "Add to cart" : "Out of stock"}
      </button>
    </div>
  </article>`;
}

export default function (el) {
  const data = el.querySelector("script[data-shop-products]");
  const products = JSON.parse(data.textContent);
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const activeCategory = signal("All");
  const query = signal("");
  const sort = signal("featured");
  const inStockOnly = signal(false);

  function visible() {
    const q = query().trim().toLowerCase();
    const cat = activeCategory();
    const stock = inStockOnly();

    let out = products.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (stock && !p.inStock) return false;
      if (q && !`${p.name} ${p.brand}`.toLowerCase().includes(q)) return false;
      return true;
    });

    const by = sort();
    if (by === "price-asc") out = out.slice().sort((a, b) => a.price - b.price);
    else if (by === "price-desc") out = out.slice().sort((a, b) => b.price - a.price);
    else if (by === "rating") out = out.slice().sort((a, b) => b.rating - a.rating);

    return out;
  }

  return html`
    <div class="shop__toolbar">
      <div class="shop__chips">
        ${categories.map(
          (c) => html`<button
            class=${() => "chip" + (activeCategory() === c ? " chip--active" : "")}
            onclick=${() => activeCategory.set(c)}
          >
            ${c}
          </button>`,
        )}
      </div>
      <div class="shop__controls">
        <input
          class="shop__search"
          type="search"
          placeholder="Search products…"
          value=${query}
          oninput=${(e) => query.set(e.target.value)}
        />
        <select class="shop__sort" onchange=${(e) => sort.set(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
        <label class="shop__stock">
          <input
            type="checkbox"
            checked=${inStockOnly}
            onchange=${(e) => inStockOnly.set(e.target.checked)}
          />
          In stock only
        </label>
      </div>
    </div>

    <p class="shop__count">
      ${() => `Showing ${visible().length} of ${products.length} products`}
    </p>

    <div class="product-grid">
      ${list(
        visible,
        (p) => p.id,
        (p) => card(p),
      )}
    </div>
  `;
}
