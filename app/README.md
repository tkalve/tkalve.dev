# tkalve.dev

Personal site and a home for small browser-based tools.

## Stack

- React 19 + TypeScript + Vite
- [TanStack Router](https://tanstack.com/router) (code-based routes in `src/router.tsx`)
- CSS Modules, with design tokens in `src/styles/global.css`

## Structure

```
src/
  components/<Component>/<Component>.tsx   shared UI (Header, Footer, Button, ToolCard, …)
  pages/<Page>/<Page>.tsx                  route pages (Home, Tools, Tool, About, NotFound)
  tools/
    registry.ts                            list of tools shown on /tools and the home page
    types.ts                               ToolMeta
    <tool>/
      meta.tsx                             name, slug, description, lazy loader
      components/<Component>/…             tool-specific UI
      utils/…                              tool-specific logic
```

## Adding a tool

1. Create `src/tools/<slug>/meta.tsx` exporting a `ToolMeta` with a `load` that lazy-imports the root component.
2. Add it to `TOOLS` in `src/tools/registry.ts`. It appears at `/tools/<slug>` automatically.

## Scripts

```
npm run dev      # start dev server
npm run build    # type-check and build
npm run lint     # oxlint
npm run preview  # serve the build
npm test         # unit tests (vitest), *.test.ts next to the code
npm run test:e2e # end-to-end tests (playwright), in e2e/
```

## Tests

- **Unit** (`vitest`): pure utilities such as `src/tools/materializer/utils/*.test.ts` and the tool registry.
- **E2E** (`@playwright/test`): `e2e/*.spec.ts` build and serve the app, then exercise navigation and the Materializer
  (load `e2e/fixtures/cube.glb`, edit a material, export). Regenerate the fixture with `node e2e/fixtures/make-fixture.mjs`.
  First run: `npx playwright install chromium`.
