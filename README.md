# server-driven-framework

A from-scratch, server-driven frontend framework — built step by step to explore an alternative to large client bundles and rerender-based UIs.

## Ideas

- **HTML over the wire.** Pages and components are plain functions that return HTML. The server renders, the client swaps fragments — no client-side route bundles.
- **No build step.** TypeScript runs directly on Node via `--experimental-strip-types`. Nothing to compile.
- **Feels like a frontend framework.** Navigation, actions, and loading states are expressed declaratively; HTTP/transport details stay hidden.
- **Headless.** The framework ships zero CSS — only class names. Styling is the app's job.
- **Islands for interactivity.** Client widgets use fine-grained signals (no virtual DOM, no diffing, no rerender). Their JS loads only on the pages that use them.

## Reactive engine

The client engine (`framework/client/reactive.js`) is a small fine-grained reactivity system:

- `signal` / `effect` / `computed` — reads auto-subscribe the running effect; writes notify only the effects that read them.
- A reactive `html` tagged template that parses once (cached), clones a precomputed element, and wires `${...}` bindings directly to DOM via effects.
- `list(source, keyOf, render)` — keyed list reconciliation (reuse unchanged nodes, batch inserts via DocumentFragment, bulk-remove via Range). On raw DOM operations it outpaces a React 19 equivalent in the included stress test.

## Run

```sh
npm start          # node --experimental-strip-types app/main.ts
# http://localhost:3000
```

## Demo routes

- `/shop` — server-rendered product grid (1000 items) enhanced in the browser with live, reactive filtering and sorting.
- `/stress` — list-mutation benchmark (update one / all, add, remove, rebuild).
- `/counter`, `/search`, `/big`, `/widgets` — smaller feature demos.

> A learning project: the goal is to understand each layer by building it.
