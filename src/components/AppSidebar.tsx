'use client'

import { Home, BookOpen, FolderGit2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator
} from '@/components/ui/sidebar'
import { projectsData } from '@/data/projects'

type NavItem = {
    title: string
    url: string
    icon?: React.ComponentType<{ className?: string }>
    items?: { title: string; url: string }[]
}

const navItems: NavItem[] = [
    { title: 'Home', url: '/', icon: Home },
    {
        title: 'CS180',
        url: '/projects/',
        icon: BookOpen,
        items: projectsData
            .filter(p => p.collection === 'cs180' && Boolean(p.slug))
            .map(p => ({ title: p.shortTitle ?? p.title, url: `/projects/${p.slug}` }))
    },
    {
        title: 'Projects',
        url: '/projects',
        icon: FolderGit2,
        items: projectsData
            .filter(p => Boolean(p.slug))
            .map(p => ({ title: p.title, url: `/projects/${p.slug}` }))
    }
]

export function AppSidebar() {
    const pathname = usePathname() || '/'

    const normalize = (url: string) =>
        url !== '/' && url.endsWith('/') ? url.slice(0, -1) : url

    return (
        <Sidebar side='left' collapsible='offcanvas'>
            <SidebarHeader>
                <div className='px-2 text-sm font-medium'>Navigation</div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Sections</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map(item => {
                                const base = normalize(item.url)
                                const parentActive =
                                    base === '/'
                                        ? pathname === '/'
                                        : pathname.startsWith(base)

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={parentActive}>
                                            <Link
                                                href={item.url}
                                                aria-current={parentActive ? 'page' : undefined}
                                            >
                                                {item.icon ? <item.icon /> : null}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        {item.items && item.items.length > 0 ? (
                                            <SidebarMenuSub>
                                                {item.items.map(sub => {
                                                    const subActive =
                                                        normalize(sub.url) === pathname
                                                    return (
                                                        <SidebarMenuSubItem key={sub.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={subActive}
                                                            >
                                                                <Link
                                                                    href={sub.url}
                                                                    aria-current={subActive ? 'page' : undefined}
                                                                >
                                                                    {sub.title}
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )
                                                })}
                                            </SidebarMenuSub>
                                        ) : null}
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
