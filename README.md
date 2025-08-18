personal website; [check me out](https://ozanbayiz.github.io/)

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
  shared/              # Cross-cutting UI primitives, hooks, utils, mdx glue
    ui/                # shadcn components (moved from components/ui)
    components/        # SectionDivider, ExternalLink, etc.
    hooks/             # useIsMobile, useScrollSpy
    lib/               # utils.ts, hue.ts, hue-script.ts
    mdx/               # mdx-client, mdx-components, remark plugins
    types/             # shared types like content Heading
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
- Shared helpers: `@/shared/{components,hooks,lib,mdx,types}`

### Notes
- MDX remark plugin is wired from `src/shared/mdx/plugins` in `next.config.ts`
- `next export` is enabled; custom redirects won’t apply at runtime (see Next.js docs)
