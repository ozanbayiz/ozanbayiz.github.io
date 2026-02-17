// Registry of lazy loaders for Projects MDX content. Do NOT import MDX here on the server.
import type { Heading } from '@/types/content'
import type { ComponentType } from 'react'

type MdxModule = {
  default: ComponentType<Record<string, unknown>>
  headings?: Heading[]
}

export const projectsMdxLoaders: Record<string, () => Promise<MdxModule>> = {
  // Canonical keys: "{collection}/{slug}"
  // CS184
  'cs184/hw1': () => import('./cs184/hw1.mdx'),
  // CS185
  'cs185/hw1': () => import('./cs185/hw1.mdx'),
  'cs185/hw2': () => import('./cs185/hw2.mdx'),
  // CS280
  'cs280/hw1': () => import('./cs280/hw1.mdx'),
  'cs280/hw2': () => import('./cs280/hw2.mdx'),
  // Misc academic
  'misc-academic/idarve': () => import('./misc-academic/idarve.mdx'),
  // Personal
  'personal/dit-rf': () => import('./personal/dit-rf.mdx'),
  'personal/personal-website': () => import('./personal/personal-website.mdx'),
  // CS180 (canonical)
  'cs180/proj1': () => import('./cs180/proj1.mdx'),
  'cs180/proj2': () => import('./cs180/proj2.mdx'),
  'cs180/proj3': () => import('./cs180/proj3.mdx'),
  'cs180/proj4': () => import('./cs180/proj4.mdx'),
  'cs180/proj5a': () => import('./cs180/proj5a.mdx'),
  'cs180/proj5b': () => import('./cs180/proj5b.mdx'),
  'cs180/proj6': () => import('./cs180/proj6.mdx'),

  // Legacy aliases (slug-only or old cs180-proj* keys)
  'cs184-hw1': () => import('./cs184/hw1.mdx'),
  'cs185-hw1': () => import('./cs185/hw1.mdx'),
  'cs185-hw2': () => import('./cs185/hw2.mdx'),
  'cs280-hw1': () => import('./cs280/hw1.mdx'),
  'cs280-hw2': () => import('./cs280/hw2.mdx'),
  idarve: () => import('./misc-academic/idarve.mdx'),
  'dit-rf': () => import('./personal/dit-rf.mdx'),
  'personal-website': () => import('./personal/personal-website.mdx'),
  'cs180-proj1': () => import('./cs180/proj1.mdx'),
  'cs180-proj2': () => import('./cs180/proj2.mdx'),
  'cs180-proj3': () => import('./cs180/proj3.mdx'),
  'cs180-proj4': () => import('./cs180/proj4.mdx'),
  'cs180-proj5a': () => import('./cs180/proj5a.mdx'),
  'cs180-proj5b': () => import('./cs180/proj5b.mdx'),
  'cs180-proj6': () => import('./cs180/proj6.mdx')
}


