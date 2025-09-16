# Architecture

This document explains how the codebase is organized, the rationale behind the structure, and the dependency boundaries we enforce for scalability, reusability, and maintainability.

## High-level overview

- Framework: Next.js App Router (React 19)
- Export target: Static (`output: export`) — redirects/rewrite limitations apply
- Styling: Tailwind CSS, shadcn/ui primitives
- Content: MDX with remark/rehype plugins (including custom heading collection)
- Images: Prefer `next/image` for LCP and bandwidth; some MDX cases use `<img>` by design

## Folder layout (feature-first)

```
src/
  app/                 # Route segments, page/layout files, server boundaries
    providers.tsx      # Global providers (theme + hue script bootstrap)
    (routes)
  content/             # MDX content and lazy-loader registries
    projects/
      index.ts         # Dynamic import registry for project MDX
      (mdx files)
  entities/            # Domain models and data contracts (no UI)
    project/
      model/projects.ts
  features/            # Feature modules (feature UI + orchestration)
    home/
      components/
    projects/
      components/      # ProjectCard, ProjectHeader, ProjectSidebarShell
      data/            # Barrel re-exports from entities
      mdx/             # ProjectsMdx client wrapper
    lightbox/
      components/      # Figure, ImageTile, MdxImg
      lightbox/        # LightboxProvider, LightboxModal
      index.ts
  shared/              # Cross-cutting UI primitives and MDX glue
    ui/                # shadcn/ui primitives
    mdx/               # mdx-client, mdx-components, remark plugins
  components/          # Simple presentational shared components
  hooks/               # useIsMobile, useScrollSpy
  lib/                 # utils.ts, hue.ts, hue-script.ts
  types/               # Shared types (e.g., content Heading)
```

## Module boundaries (allowed imports)

Think of the codebase in layers. Upper layers may depend on lower layers, never the reverse.

- app → may import: features, shared, entities, lib, hooks, components, types
- features → may import: shared, entities, lib, hooks, components, types
- entities → may import: types (pure types only). Must not import features or app
- shared → should not import from features or app. `shared/ui` may import `lib`

Guiding principles:
- Hide implementation details behind feature barrels (`features/<name>/index.ts`).
- Prefer importing from public entry points over deep paths.
- Keep business/domain data in `entities` so features remain thin and reusable.

## Import aliases

- Base alias: `@/*` → `src/*`
- UI primitives: `@/shared/ui/*`
- Features: `@/features/<feature>` (prefer barrel re-exports)
- Domain: `@/entities/...`
- Helpers: `@/{components,hooks,lib,types}` and `@/shared/{mdx,ui}`

## Client/Server boundaries

- Server Components by default under `app/`. Use `'use client'` only where necessary.
- Pass serializable props across RSC boundaries.
- Co-locate client logic (interactions, effects) in leaf components.

## MDX pipeline

- `content/projects/index.ts` registers lazy loaders for MDX by slug.
- `shared/mdx/mdx-client.tsx` dynamically loads MDX and dispatches custom events:
  - `mdx:headings` with compile-time heading metadata
  - `mdx:content:loaded` to coordinate TOC DOM fallback
- `shared/mdx/plugins/remark-collect-headings.ts` collects headings at build time.
- `src/mdx-components.tsx` re-exports MDX component mappings from `shared/mdx/mdx-components.tsx`.

## shadcn/ui primitives

- Live under `shared/ui/*` and are imported as `@/shared/ui/<component>`.
- These components may import from `@/lib/*`. They must not import features.

## Import order and style

- Group imports in this order to satisfy `import/order`:
  1. Node/3rd-party
  2. Next.js/React
  3. Project aliases (entities → features → shared)
  4. Relative imports (../ then ./)
- Keep type-only imports adjacent to their value imports where helpful.

Example:

```ts
import Link from 'next/link'

import { projectsData, ProjectCard } from '@/features/projects'
import { Breadcrumb } from '@/shared/ui/breadcrumb'
import { Separator } from '@/shared/ui/separator'
```

## Linting boundaries (recommended)

To enforce layering at scale, consider `eslint-plugin-boundaries` or `eslint-plugin-import` rules.

Example (flat-config style snippet):

```ts
import boundaries from 'eslint-plugin-boundaries'

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/internal-regex': '^@/',
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'shared', pattern: 'src/shared/**' },
        { type: 'lib', pattern: 'src/lib/**' },
        { type: 'hooks', pattern: 'src/hooks/**' },
        { type: 'components', pattern: 'src/components/**' },
        { type: 'types', pattern: 'src/types/**' }
      ]
    },
    rules: {
      // No upward imports
      'boundaries/no-unknown-files': 'off',
      'boundaries/element-types': ['error', {
        default: 'disallow',
        message: 'Disallowed cross-layer import',
        rules: [
          { from: 'app', allow: ['features', 'shared', 'entities', 'lib', 'hooks', 'components', 'types'] },
          { from: 'features', allow: ['shared', 'entities', 'lib', 'hooks', 'components', 'types'] },
          { from: 'entities', allow: ['types'] },
          { from: 'shared', allow: ['shared', 'lib', 'types'] },
          { from: 'lib', allow: ['types'] },
          { from: 'hooks', allow: ['types', 'lib'] },
          { from: 'components', allow: ['types'] }
        ]
      }]
    }
  }
]
```

## Adding a new feature

1. Create `src/features/<feature>/{components,data,mdx?}` with a minimal barrel `index.ts`.
2. Keep orchestration/UI here; re-export domain data from `entities` via `features/<feature>/data` if convenient.
3. Compose in `app/` pages and layouts.

## Adding shared primitives

- Add new primitives to `shared/ui` or presentational parts to top-level `components`.
- Shared hooks live in top-level `hooks`; they must not depend on feature code.

## Entities: domain data

- Define domain types and canonical data in `entities/*`.
- Avoid UI or framework dependencies here for portability and unit testing.

## Performance & accessibility

- Prefer `next/image` for hero and content images; where `<img>` is necessary (e.g., MDX lightbox), ensure `alt` text and reasonable sizing.
- Use semantic markup (headings, lists) in MDX; ensure keyboard accessibility for dialogs and nav.

## Static export caveats

- Redirects/rewrites in `next.config.ts` are not applied at runtime under `output: 'export'`.
- Prefer static redirects at hosting/CDN or replace with content-level links.

## Testing (recommended)

- Co-locate unit tests as `*.test.ts[x]` next to implementations.
- For UI primitives and complex components, consider Storybook for visual review.

---

This architecture aims to maximize reuse (shared primitives), clarity (feature-first), and stability (entities as the domain source of truth), while keeping React Server Component boundaries clean and MDX content ergonomics high.
