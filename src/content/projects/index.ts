// Registry of lazy loaders for Projects MDX content. Do NOT import MDX here on the server.
import type { Heading } from '@/types/content'
import type { ComponentType } from 'react'

type MdxModule = {
  default: ComponentType<Record<string, unknown>>
  headings?: Heading[]
}

export const projectsMdxLoaders: Record<string, () => Promise<MdxModule>> = {
  'misc-academic/idarve': () => import('./misc-academic/idarve.mdx'),
  'personal/dit-rf': () => import('./personal/dit-rf.mdx'),
  'personal/personal-website': () => import('./personal/personal-website.mdx'),
  'cs180-proj1': () => import('./cs180/proj1.mdx'),
  'cs180-proj2': () => import('./cs180/proj2.mdx'),
  'cs180-proj3': () => import('./cs180/proj3.mdx'),
  'cs180-proj4': () => import('./cs180/proj4.mdx'),
  'cs180-proj5a': () => import('./cs180/proj5a.mdx'),
  'cs180-proj5b': () => import('./cs180/proj5b.mdx'),
  'cs180-proj6': () => import('./cs180/proj6.mdx')
}


