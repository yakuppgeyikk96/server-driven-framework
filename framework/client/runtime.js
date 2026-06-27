const APP = "#app";

function patternToRegex(pattern) {
  const parts = pattern
    .split("/")
    .filter(Boolean)
    .map((segment) => (segment.startsWith(":") ? "[^/]+" : segment));
  return new RegExp("^/" + parts.join("/") + "/?$");
}

const routeMatchers = (window.__SDF_ROUTES__ || []).map(patternToRegex);

function isKnownRoute(pathname) {
  return routeMatchers.some((re) => re.test(pathname));
}

function isInternalNavigation(link) {
  if (link.target === "_blank") return false;
  if (link.hasAttribute("download")) return false;
  if (link.hasAttribute("data-native")) return false;

  const dest = new URL(link.href);
  if (dest.origin !== location.origin) return false;
  if (dest.pathname === location.pathname && dest.search === location.search && dest.hash) {
    return false;
  }
  return isKnownRoute(dest.pathname);
}

const mounted = new WeakSet();

async function mountWidgets(root) {
  for (const el of root.querySelectorAll("[data-widget]")) {
    if (mounted.has(el)) continue;
    mounted.add(el);
    const name = el.getAttribute("data-widget");
    try {
      const module = await import(`/widgets/${name}.js`);
      const view = module.default ? module.default(el) : null;
      if (view) el.replaceChildren(view);
    } catch (error) {
      console.error(`widget "${name}" failed`, error);
    }
  }
}

async function navigate(url, push) {
  const app = document.querySelector(APP);
  if (!app) {
    window.location.href = url;
    return;
  }

  document.documentElement.classList.add("is-navigating");
  try {
    const res = await fetch(url, { headers: { "X-SDF-Fragment": "1" } });
    app.innerHTML = await res.text();

    const title = res.headers.get("X-SDF-Title");
    if (title) document.title = decodeURIComponent(title);

    if (push) history.pushState(null, "", url);
    window.scrollTo(0, 0);
    mountWidgets(app);
  } finally {
    document.documentElement.classList.remove("is-navigating");
  }
}

function collectBody(source) {
  if (source.tagName === "FORM") {
    return new URLSearchParams(new FormData(source)).toString();
  }
  if (source.value !== undefined && source.value !== null) {
    const name = source.getAttribute("name") || "value";
    return new URLSearchParams({ [name]: source.value }).toString();
  }
  return "";
}

function applySwap(target, html, mode) {
  if (mode === "outer") target.outerHTML = html;
  else if (mode === "append") target.insertAdjacentHTML("beforeend", html);
  else if (mode === "prepend") target.insertAdjacentHTML("afterbegin", html);
  else target.innerHTML = html;
}

function setLoading(el, on) {
  if (!el) return;
  el.classList.toggle("is-loading", on);
  if (on) el.setAttribute("aria-busy", "true");
  else el.removeAttribute("aria-busy");
}

function flashError(el) {
  if (!el) return;
  el.classList.add("is-error");
  setTimeout(() => el.classList.remove("is-error"), 1500);
}

async function runAction(source) {
  const url = source.getAttribute("data-action");
  const targetSelector = source.getAttribute("data-target");
  const swap = source.getAttribute("data-swap") || "inner";
  const target = targetSelector ? document.querySelector(targetSelector) : source;

  const isButton = source.tagName === "BUTTON";
  if (isButton) source.disabled = true;

  const indicate = setTimeout(() => {
    setLoading(source, true);
    setLoading(target, true);
  }, 120);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "X-SDF-Fragment": "1",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: collectBody(source),
    });
    const html = await res.text();
    if (!res.ok) throw new Error("action failed");
    if (target) {
      applySwap(target, html, swap);
      mountWidgets(target.parentNode || target);
    }
  } catch (error) {
    flashError(source);
  } finally {
    clearTimeout(indicate);
    setLoading(source, false);
    setLoading(target, false);
    if (isButton) source.disabled = false;
  }
}

function triggerOf(source) {
  return source.getAttribute("data-trigger") || "click";
}

for (const type of ["input", "change", "submit"]) {
  document.addEventListener(type, (event) => {
    const source = event.target.closest("[data-action]");
    if (!source || triggerOf(source) !== type) return;
    event.preventDefault();
    runAction(source);
  });
}

document.addEventListener("click", (event) => {
  if (event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const source = event.target.closest("[data-action]");
  if (source && triggerOf(source) === "click") {
    event.preventDefault();
    runAction(source);
    return;
  }

  const link = event.target.closest("a");
  if (!link || !link.getAttribute("href")) return;
  if (!isInternalNavigation(link)) return;

  event.preventDefault();
  navigate(link.href, true);
});

window.addEventListener("popstate", () => {
  navigate(location.href, false);
});

mountWidgets(document);
