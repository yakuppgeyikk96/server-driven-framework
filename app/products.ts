import { html, raw, type SafeHtml, type Context } from "../framework/index.ts";

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  inStock: boolean;
}

const CATALOG: Omit<Product, "id">[] = [
  {
    name: "Aurus N7 Wireless Headphones",
    brand: "Aurus",
    category: "Audio",
    price: 249.99,
    oldPrice: 299.99,
    rating: 4.6,
    reviews: 1284,
    image: "🎧",
    badge: "Sale",
    inStock: true,
  },
  {
    name: "Pulse Air Buds Pro",
    brand: "Pulse",
    category: "Audio",
    price: 129.0,
    rating: 4.4,
    reviews: 842,
    image: "🎧",
    badge: "New",
    inStock: true,
  },
  {
    name: "Boltkit Roam Bluetooth Speaker",
    brand: "Boltkit",
    category: "Audio",
    price: 89.99,
    rating: 4.5,
    reviews: 2310,
    image: "🔊",
    inStock: true,
  },
  {
    name: "Nordwave Studio One Monitors",
    brand: "Nordwave",
    category: "Audio",
    price: 379.0,
    rating: 4.8,
    reviews: 196,
    image: "🔊",
    inStock: false,
  },
  {
    name: "Vellum Tab 11 Tablet",
    brand: "Vellum",
    category: "Mobile",
    price: 459.0,
    oldPrice: 519.0,
    rating: 4.3,
    reviews: 671,
    image: "📱",
    badge: "Sale",
    inStock: true,
  },
  {
    name: "Vellum Phone 5",
    brand: "Vellum",
    category: "Mobile",
    price: 799.0,
    rating: 4.7,
    reviews: 3120,
    image: "📱",
    badge: "Best Seller",
    inStock: true,
  },
  {
    name: "Quill 14 Ultrabook",
    brand: "Quill",
    category: "Computing",
    price: 1199.0,
    rating: 4.6,
    reviews: 488,
    image: "💻",
    inStock: true,
  },
  {
    name: "Quill 16 Pro Laptop",
    brand: "Quill",
    category: "Computing",
    price: 1899.0,
    oldPrice: 2099.0,
    rating: 4.9,
    reviews: 232,
    image: "💻",
    badge: "Sale",
    inStock: true,
  },
  {
    name: "Clickbar Mechanical Keyboard",
    brand: "Clickbar",
    category: "Computing",
    price: 119.99,
    rating: 4.7,
    reviews: 1542,
    image: "⌨️",
    inStock: true,
  },
  {
    name: "Glide Pro Wireless Mouse",
    brand: "Glide",
    category: "Computing",
    price: 59.99,
    rating: 4.5,
    reviews: 2044,
    image: "🖱️",
    inStock: true,
  },
  {
    name: "Vista 27 4K Monitor",
    brand: "Vista",
    category: "Computing",
    price: 329.0,
    oldPrice: 399.0,
    rating: 4.4,
    reviews: 813,
    image: "🖥️",
    badge: "Sale",
    inStock: true,
  },
  {
    name: "Vista 34 Ultrawide",
    brand: "Vista",
    category: "Computing",
    price: 649.0,
    rating: 4.6,
    reviews: 357,
    image: "🖥️",
    inStock: false,
  },
  {
    name: "Lumen Desk Lamp",
    brand: "Lumen",
    category: "Home",
    price: 44.99,
    rating: 4.3,
    reviews: 988,
    image: "💡",
    inStock: true,
  },
  {
    name: "Lumen Smart Bulb (4-pack)",
    brand: "Lumen",
    category: "Home",
    price: 39.99,
    rating: 4.2,
    reviews: 1765,
    image: "💡",
    inStock: true,
  },
  {
    name: "Drift Robot Vacuum",
    brand: "Drift",
    category: "Home",
    price: 299.0,
    oldPrice: 349.0,
    rating: 4.5,
    reviews: 1402,
    image: "🤖",
    badge: "Sale",
    inStock: true,
  },
  {
    name: "Hearth Air Purifier",
    brand: "Hearth",
    category: "Home",
    price: 159.0,
    rating: 4.6,
    reviews: 624,
    image: "🌀",
    inStock: true,
  },
  {
    name: "Brew Co. Pour-Over Kettle",
    brand: "Brew Co.",
    category: "Kitchen",
    price: 74.99,
    rating: 4.7,
    reviews: 1190,
    image: "☕",
    badge: "New",
    inStock: true,
  },
  {
    name: "Brew Co. Espresso Maker",
    brand: "Brew Co.",
    category: "Kitchen",
    price: 449.0,
    rating: 4.8,
    reviews: 540,
    image: "☕",
    badge: "Best Seller",
    inStock: true,
  },
  {
    name: "Forge Chef's Knife 8\"",
    brand: "Forge",
    category: "Kitchen",
    price: 89.0,
    rating: 4.9,
    reviews: 2876,
    image: "🔪",
    inStock: true,
  },
  {
    name: "Forge Cast Iron Skillet",
    brand: "Forge",
    category: "Kitchen",
    price: 54.99,
    rating: 4.7,
    reviews: 3401,
    image: "🍳",
    inStock: true,
  },
  {
    name: "Pixl X100 Mirrorless Camera",
    brand: "Pixl",
    category: "Photography",
    price: 1299.0,
    rating: 4.8,
    reviews: 410,
    image: "📷",
    inStock: true,
  },
  {
    name: "Pixl 35mm f/1.8 Lens",
    brand: "Pixl",
    category: "Photography",
    price: 399.0,
    oldPrice: 449.0,
    rating: 4.7,
    reviews: 287,
    image: "📷",
    badge: "Sale",
    inStock: true,
  },
  {
    name: "Apex Action Cam 4K",
    brand: "Apex",
    category: "Photography",
    price: 279.0,
    rating: 4.4,
    reviews: 1633,
    image: "📷",
    inStock: false,
  },
  {
    name: "Volt Power Bank 20K",
    brand: "Volt",
    category: "Power",
    price: 49.99,
    rating: 4.5,
    reviews: 5210,
    image: "🔋",
    badge: "Best Seller",
    inStock: true,
  },
  {
    name: "Volt 100W USB-C Charger",
    brand: "Volt",
    category: "Power",
    price: 39.99,
    rating: 4.6,
    reviews: 1888,
    image: "🔌",
    inStock: true,
  },
  {
    name: "Strato Drone Mini",
    brand: "Strato",
    category: "Gaming",
    price: 399.0,
    rating: 4.3,
    reviews: 521,
    image: "🛸",
    inStock: true,
  },
  {
    name: "Arcade Pro Controller",
    brand: "Arcade",
    category: "Gaming",
    price: 69.99,
    rating: 4.6,
    reviews: 2740,
    image: "🎮",
    inStock: true,
  },
  {
    name: "Arcade Elite Headset",
    brand: "Arcade",
    category: "Gaming",
    price: 99.99,
    oldPrice: 119.99,
    rating: 4.4,
    reviews: 1320,
    image: "🎧",
    badge: "Sale",
    inStock: true,
  },
  {
    name: "Tempo Smartwatch 3",
    brand: "Tempo",
    category: "Wearables",
    price: 199.0,
    rating: 4.5,
    reviews: 2611,
    image: "⌚",
    badge: "New",
    inStock: true,
  },
  {
    name: "Tempo Fit Band",
    brand: "Tempo",
    category: "Wearables",
    price: 79.99,
    rating: 4.3,
    reviews: 4012,
    image: "⌚",
    inStock: true,
  },
  {
    name: "Stride Running Shoes",
    brand: "Stride",
    category: "Fitness",
    price: 129.0,
    rating: 4.6,
    reviews: 1944,
    image: "👟",
    inStock: true,
  },
  {
    name: "Stride Pro Treadmill",
    brand: "Stride",
    category: "Fitness",
    price: 899.0,
    oldPrice: 999.0,
    rating: 4.4,
    reviews: 318,
    image: "🏃",
    badge: "Sale",
    inStock: false,
  },
  {
    name: "Cyclo Indoor Bike",
    brand: "Cyclo",
    category: "Fitness",
    price: 749.0,
    rating: 4.5,
    reviews: 502,
    image: "🚲",
    inStock: true,
  },
  {
    name: "Cyclo Smart Helmet",
    brand: "Cyclo",
    category: "Fitness",
    price: 159.0,
    rating: 4.2,
    reviews: 233,
    image: "🪖",
    inStock: true,
  },
  {
    name: "Nimbus Cloud SSD 1TB",
    brand: "Nimbus",
    category: "Storage",
    price: 109.0,
    oldPrice: 139.0,
    rating: 4.7,
    reviews: 2255,
    image: "💾",
    badge: "Sale",
    inStock: true,
  },
  {
    name: "Nimbus Portable HDD 4TB",
    brand: "Nimbus",
    category: "Storage",
    price: 99.0,
    rating: 4.5,
    reviews: 1677,
    image: "💾",
    inStock: true,
  },
  {
    name: "Beacon Mesh WiFi 6 Router",
    brand: "Beacon",
    category: "Networking",
    price: 179.0,
    rating: 4.4,
    reviews: 1290,
    image: "📡",
    inStock: true,
  },
  {
    name: "Beacon Range Extender",
    brand: "Beacon",
    category: "Networking",
    price: 49.99,
    rating: 4.1,
    reviews: 876,
    image: "📡",
    inStock: true,
  },
  {
    name: "Cozy Weighted Blanket",
    brand: "Cozy",
    category: "Home",
    price: 69.99,
    rating: 4.7,
    reviews: 3550,
    image: "🛏️",
    badge: "Best Seller",
    inStock: true,
  },
  {
    name: "Cozy Memory Foam Pillow",
    brand: "Cozy",
    category: "Home",
    price: 39.99,
    rating: 4.5,
    reviews: 2890,
    image: "🛏️",
    inStock: true,
  },
  {
    name: "Aroma Diffuser + Oils",
    brand: "Aroma",
    category: "Home",
    price: 34.99,
    rating: 4.4,
    reviews: 1410,
    image: "🌿",
    inStock: true,
  },
  {
    name: "Verde Self-Watering Planter",
    brand: "Verde",
    category: "Home",
    price: 29.99,
    rating: 4.6,
    reviews: 705,
    image: "🪴",
    badge: "New",
    inStock: true,
  },
  {
    name: 'Inkwell e-Reader 7"',
    brand: "Inkwell",
    category: "Mobile",
    price: 149.0,
    rating: 4.7,
    reviews: 2133,
    image: "📖",
    inStock: true,
  },
  {
    name: "Scribe Smart Notebook",
    brand: "Scribe",
    category: "Computing",
    price: 27.99,
    rating: 4.3,
    reviews: 980,
    image: "📓",
    inStock: true,
  },
  {
    name: "Lumen LED Strip 5m",
    brand: "Lumen",
    category: "Home",
    price: 24.99,
    rating: 4.2,
    reviews: 4120,
    image: "💡",
    inStock: true,
  },
  {
    name: "Boltkit Mini Speaker",
    brand: "Boltkit",
    category: "Audio",
    price: 39.99,
    oldPrice: 49.99,
    rating: 4.3,
    reviews: 1560,
    image: "🔊",
    badge: "Sale",
    inStock: true,
  },
  {
    name: "Glint Wireless Charger Pad",
    brand: "Glint",
    category: "Power",
    price: 29.99,
    rating: 4.4,
    reviews: 2200,
    image: "🔌",
    inStock: true,
  },
  {
    name: "Optic Blue-Light Glasses",
    brand: "Optic",
    category: "Wearables",
    price: 45.0,
    rating: 4.2,
    reviews: 612,
    image: "👓",
    inStock: true,
  },
  {
    name: "Trail 40L Backpack",
    brand: "Trail",
    category: "Fitness",
    price: 119.0,
    rating: 4.8,
    reviews: 1305,
    image: "🎒",
    badge: "Best Seller",
    inStock: true,
  },
  {
    name: "Thermo Smart Mug",
    brand: "Thermo",
    category: "Kitchen",
    price: 89.99,
    rating: 4.1,
    reviews: 430,
    image: "☕",
    badge: "New",
    inStock: false,
  },
];

const delay = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));

const COLORS = [
  "Midnight",
  "Silver",
  "Graphite",
  "Ocean Blue",
  "Sand",
  "Forest",
];

function buildCatalog(count: number): Product[] {
  const out: Product[] = [];
  for (let i = 0; i < count; i++) {
    const base = CATALOG[i % CATALOG.length];
    const color = COLORS[i % COLORS.length];
    const factor = 1 + (((i * 37) % 21) - 10) / 100; // deterministic ±10%
    const rating = base.rating + (((i * 13) % 7) - 3) / 10; // ±0.3
    out.push({
      ...base,
      id: i + 1,
      name: count > CATALOG.length ? `${base.name} — ${color}` : base.name,
      price: Math.round(base.price * factor * 100) / 100,
      oldPrice: base.oldPrice
        ? Math.round(base.oldPrice * factor * 100) / 100
        : undefined,
      rating: Math.round(Math.min(5, Math.max(3.5, rating)) * 10) / 10,
      reviews: base.reviews + ((i * 97) % 900),
      inStock: i % 11 !== 0,
    });
  }
  return out;
}

export async function fetchProducts(
  count = CATALOG.length,
): Promise<Product[]> {
  await delay(120); // pretend we're calling a database / upstream API
  return buildCatalog(count);
}

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
        <span class="product__stars" aria-hidden="true"
          >${stars(p.rating)}</span
        >
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

function ProductGrid(products: Product[]): SafeHtml {
  return html`<div class="product-grid">${products.map(ProductCard)}</div>`;
}

function embedData(products: Product[]): SafeHtml {
  const json = JSON.stringify(products).replace(/</g, "\\u003c");
  return raw(
    `<script type="application/json" data-shop-products>${json}</script>`,
  );
}

export async function ProductsPage(ctx: Context): Promise<SafeHtml> {
  const requested = Number(ctx.query.get("n") ?? 1000) || 1000;
  const count = Math.min(Math.max(requested, 1), 5000);
  const products = await fetchProducts(count);
  const categories = new Set(products.map((p) => p.category));
  return html`<h1>Shop</h1>
    <p class="shop__intro">
      ${products.length} products across ${categories.size} categories —
      rendered on the server, then enhanced in the browser with live filtering
      and sorting (no round-trips).
    </p>
    <section class="shop" data-widget="shop">
      ${embedData(products)}
      <!-- Server-rendered fallback; the widget replaces this once its JS loads. -->
      ${ProductGrid(products)}
    </section>`;
}
