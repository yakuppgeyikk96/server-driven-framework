let activeEffect = null;

export function signal(initial) {
  let value = initial;
  const subscribers = new Set();

  function read() {
    if (activeEffect) {
      subscribers.add(activeEffect);
      activeEffect.deps.add(subscribers);
    }
    return value;
  }

  read.set = (next) => {
    const resolved = typeof next === "function" ? next(value) : next;
    if (Object.is(resolved, value)) return;
    value = resolved;
    for (const effect of [...subscribers]) effect.run();
  };

  read.peek = () => value;

  return read;
}

export function effect(fn) {
  const runner = {
    deps: new Set(),
    run() {
      for (const dep of runner.deps) dep.delete(runner);
      runner.deps.clear();

      const previous = activeEffect;
      activeEffect = runner;
      try {
        fn();
      } finally {
        activeEffect = previous;
      }
    },
  };

  runner.run();
  return runner;
}

export function computed(fn) {
  const derived = signal(undefined);
  effect(() => derived.set(fn()));
  return derived;
}

const ATTR_TAIL = /(\s)([\w.@:-]+)=$/;
const templateCache = new WeakMap();

function parseTemplate(strings) {
  let markup = "";
  const slots = [];

  for (let i = 0; i < strings.length; i++) {
    markup += strings[i];
    if (i >= strings.length - 1) continue;

    const attr = ATTR_TAIL.exec(markup);
    if (attr) {
      markup = markup.slice(0, attr.index) + attr[1] + `data-bind-${i}`;
      slots.push({ type: "attr", index: i, name: attr[2] });
    } else {
      markup += `<!--bind-${i}-->`;
      slots.push({ type: "node", index: i });
    }
  }

  const template = document.createElement("template");
  template.innerHTML = markup;
  const holder = document.createElement("div");
  holder.appendChild(template.content); // adopt nodes into a plain element

  for (const slot of slots) {
    let target;
    if (slot.type === "attr") {
      target = holder.querySelector(`[data-bind-${slot.index}]`);
      target.removeAttribute(`data-bind-${slot.index}`);
    } else {
      target = findMarker(holder, `bind-${slot.index}`);
    }
    slot.path = pathTo(holder, target); // childNode-index path, computed once
  }

  return { holder, slots };
}

function pathTo(root, target) {
  const path = [];
  let node = target;
  while (node !== root) {
    const parent = node.parentNode;
    path.push(Array.prototype.indexOf.call(parent.childNodes, node));
    node = parent;
  }
  return path.reverse();
}

function nodeAt(root, path) {
  let node = root;
  for (const index of path) node = node.childNodes[index];
  return node;
}

export function html(strings, ...values) {
  let entry = templateCache.get(strings);
  if (!entry) {
    entry = parseTemplate(strings); // parse ONCE per template literal
    templateCache.set(strings, entry);
  }

  const clone = entry.holder.cloneNode(true); // ELEMENT clone (fast)

  // Resolve ALL slot nodes first (on the pristine clone), then bind — so that
  // binding-induced mutations can't shift the childNode paths of later slots.
  const targets = entry.slots.map((slot) => nodeAt(clone, slot.path));
  entry.slots.forEach((slot, i) => {
    const node = targets[i];
    if (slot.type === "attr") bindAttr(node, slot.name, values[slot.index]);
    else bindNode(node, values[slot.index]);
  });

  const root = document.createDocumentFragment();
  while (clone.firstChild) root.appendChild(clone.firstChild);
  return root;
}

function bindAttr(el, name, value) {
  if (name.startsWith("on") && typeof value === "function") {
    el.addEventListener(name.slice(2), value);
  } else if (typeof value === "function") {
    effect(() => setAttr(el, name, value()));
  } else {
    setAttr(el, name, value);
  }
}

const PROPERTY_ATTRS = new Set(["value", "checked", "selected", "disabled"]);

function setAttr(el, name, value) {
  if (PROPERTY_ATTRS.has(name)) {
    if (el[name] !== value) el[name] = value;
    return;
  }
  if (value === false || value === null || value === undefined) {
    el.removeAttribute(name);
  } else if (value === true) {
    el.setAttribute(name, "");
  } else {
    el.setAttribute(name, String(value));
  }
}

export function list(source, keyOf, render) {
  return { __list: true, source, keyOf, render };
}

function firstListNode(groups, fallback) {
  for (const group of groups.values()) {
    if (group.nodes.length) return group.nodes[0];
  }
  return fallback;
}

function removeRange(from, to) {
  if (!from || from === to) return;
  const range = document.createRange();
  range.setStartBefore(from);
  range.setEndBefore(to);
  range.deleteContents();
}

function bindList(marker, def) {
  const { source, keyOf, render } = def;
  let prev = new Map();

  effect(() => {
    const parent = marker.parentNode;
    const items = source();
    const next = new Map();
    let cursor = firstListNode(prev, marker);
    let pending = null;

    const flush = () => {
      if (!pending) return;
      parent.insertBefore(pending, cursor);
      pending = null;
    };

    for (const item of items) {
      const key = keyOf(item);
      const old = prev.get(key);

      if (old && old.item === item) {
        flush();
        for (const node of old.nodes) {
          if (node === cursor) cursor = cursor.nextSibling;
          else parent.insertBefore(node, cursor);
        }
        next.set(key, old);
      } else {
        const nodes = toNodes(render(item));
        if (!pending) pending = document.createDocumentFragment();
        for (const node of nodes) pending.appendChild(node);
        next.set(key, { item, nodes });
        if (old) {
          for (const node of old.nodes) {
            if (node === cursor) cursor = cursor.nextSibling;
            node.remove();
          }
        }
      }
    }
    flush();

    removeRange(cursor === marker ? null : cursor, marker);
    prev = next;
  });
}

function bindNode(marker, value) {
  if (value && value.__list) {
    bindList(marker, value);
    return;
  }

  if (typeof value !== "function") {
    for (const node of toNodes(value))
      marker.parentNode.insertBefore(node, marker);
    marker.remove();
    return;
  }

  let current = [];
  effect(() => {
    const next = toNodes(value());
    for (const node of current) node.remove();
    for (const node of next) marker.parentNode.insertBefore(node, marker);
    current = next;
  });
}

function toNodes(value) {
  if (value === null || value === undefined || value === false) return [];
  if (value instanceof DocumentFragment) return [...value.childNodes];
  if (value instanceof Node) return [value];
  if (Array.isArray(value)) return value.flatMap(toNodes);
  return [document.createTextNode(String(value))];
}

function findMarker(root, text) {
  const iterator = document.createNodeIterator(root, NodeFilter.SHOW_COMMENT);
  let node;
  while ((node = iterator.nextNode())) {
    if (node.nodeValue === text) return node;
  }
  return null;
}
