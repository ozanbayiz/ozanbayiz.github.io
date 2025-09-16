personal website; [check me out](https://ozanbayiz.github.io/)

## Getting Started

- **Install dependencies**: `pnpm install`
- **Run dev server**: `pnpm dev` (opens at `http://localhost:3000`)
- **Build static site**: `pnpm build` (outputs to `out/` via Next `output: 'export'`)
- **Preview build locally**: `pnpm preview` (serves `out/` at `http://localhost:3000`)
- **Serve production build**: `pnpm start` (same as preview; serves `out/`)

## Folder structure

This project uses a feature-first layout optimized for reuse and clarity.

```
src/
  app/                 # Route segments, layouts, metadata, server boundaries
    providers.tsx      # Global Providers (Theme, hue bootstrap)
    (route files)
  content/             # MDX content and lazy-loader registries
    projects/
      index.ts         # MDX dynamic import registry for projects
      (mdx files)
  entities/            # Domain models and data contracts
    project/
      model/projects.ts
  features/            # Feature modules (UI + orchestration)
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
  shared/              # shadcn and MDX glue
    ui/                # shadcn components
    mdx/               # mdx-client, mdx-components, remark plugins
  components/          # SectionDivider, ExternalLink, etc.
  hooks/               # useIsMobile, useScrollSpy
  lib/                 # utils.ts, hue.ts, hue-script.ts
  types/               # shared types like content Heading
```

### Conventions
- Components: PascalCase filenames, prefer named exports for public APIs
- Hooks: `useThing.ts[x]`
- Utils: `kebab-case.ts`
- Barrels: `index.ts` for public surface of a module

### Import aliases
- Base alias: `@/*` → `src/*`
- UI primitives: `@/shared/ui` (updated from `@/components/ui`)
- Features: import via `@/features/<feature>` barrels where possible
- Domain data: `@/entities/...`
- Helpers: `@/{components,hooks,lib,types}` and `@/shared/{mdx,ui}`

### Notes
- MDX remark plugin is wired from `src/shared/mdx/plugins` in `next.config.ts`
- `next export` is enabled; custom redirects won’t apply at runtime (see Next.js docs)
