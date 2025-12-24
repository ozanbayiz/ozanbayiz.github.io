'use client'

import { ChevronRight } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'
import {
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from '@/shared/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'

import { hasActiveDescendant, TocItem } from '../utils/toc'

type TocNodeProps = {
    item: TocItem
    depth: number
    activeId: string | null
    expandedIds: Set<string>
    onToggle: (id: string) => void
    onNavigate: (id: string) => void
}

/** Shared link content with tooltip for long titles */
function TocLinkContent({ title, isActive }: { title: string; isActive?: boolean }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className={cn(
                    'block whitespace-normal break-words overflow-hidden line-clamp-2',
                    isActive && 'font-semibold'
                )}>
                    {title}
                </span>
            </TooltipTrigger>
            <TooltipContent side='right' className='max-w-[320px]'>
                {title}
            </TooltipContent>
        </Tooltip>
    )
}

/** Expand/collapse chevron button */
function ExpandButton({
    isOpen,
    onToggle
}: {
    isOpen: boolean
    onToggle: (e: React.MouseEvent) => void
}) {
    return (
        <SidebarMenuAction
            aria-label={isOpen ? 'Collapse section' : 'Expand section'}
            aria-expanded={isOpen}
            className='text-foreground ml-1 hover:bg-transparent hover:text-accent focus:bg-transparent focus:text-accent transition-transform duration-200'
            onClick={onToggle}
        >
            <ChevronRight className={cn(
                'h-4 w-4 transition-transform duration-200',
                isOpen && 'rotate-90'
            )} />
        </SidebarMenuAction>
    )
}

/** Collapsible children wrapper with animation */
function CollapsibleChildren({
    isOpen,
    children
}: {
    isOpen: boolean
    children: React.ReactNode
}) {
    return (
        <div className={cn(
            'grid transition-all duration-200 ease-out',
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}>
            <div className='overflow-hidden'>
                {children}
            </div>
        </div>
    )
}

/**
 * Recursive TOC node component that renders at different depths.
 * - Depth 0: Top-level SidebarMenuItem
 * - Depth 1: SidebarMenuSubItem
 * - Depth 2+: Simple list items
 */
export function TocNode({
    item,
    depth,
    activeId,
    expandedIds,
    onToggle,
    onNavigate
}: TocNodeProps) {
    const hasChildren = item.children.length > 0
    const isActive = activeId === item.id
    const hasActiveChild = hasActiveDescendant(item, activeId) && !isActive
    const isExpanded = expandedIds.has(item.id)
    const isHighlighted = isActive || hasActiveChild

    const handleClick = () => {
        onNavigate(item.id)
        if (hasChildren && !isExpanded) {
            onToggle(item.id)
        }
    }

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle(item.id)
    }

    // Top-level items (depth 0)
    if (depth === 0) {
        return (
            <SidebarMenuItem
                className={cn(
                    'relative transition-colors duration-200',
                    isHighlighted && 'before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:bg-accent before:rounded-full'
                )}
            >
                <div className='flex items-center'>
                    <SidebarMenuButton
                        asChild
                        isActive={isHighlighted}
                        className={cn(
                            'text-foreground flex-1 hover:bg-transparent hover:text-accent focus:bg-transparent focus:text-accent transition-all duration-200 border-transparent',
                            isHighlighted && 'bg-accent/5 border-transparent'
                        )}
                    >
                        <a href={`#${item.id}`} onClick={handleClick}>
                            <TocLinkContent title={item.title} isActive={isHighlighted} />
                        </a>
                    </SidebarMenuButton>
                    {hasChildren && (
                        <ExpandButton isOpen={isExpanded} onToggle={handleToggle} />
                    )}
                </div>

                {hasChildren && (
                    <CollapsibleChildren isOpen={isExpanded}>
                        <SidebarMenuSub className='border-l-accent/30'>
                            {item.children.map(child => (
                                <TocNode
                                    key={child.id || child.title}
                                    item={child}
                                    depth={depth + 1}
                                    activeId={activeId}
                                    expandedIds={expandedIds}
                                    onToggle={onToggle}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleChildren>
                )}
            </SidebarMenuItem>
        )
    }

    // Second-level items (depth 1)
    if (depth === 1) {
        return (
            <SidebarMenuSubItem
                className={cn(
                    'relative transition-colors duration-200',
                    isHighlighted && 'before:absolute before:-left-[11px] before:top-1 before:bottom-1 before:w-[2px] before:bg-accent before:rounded-full'
                )}
            >
                <div className='flex items-center'>
                    <SidebarMenuSubButton
                        asChild
                        isActive={isHighlighted}
                        className={cn(
                            'transition-all duration-200 border-transparent',
                            isHighlighted && 'bg-accent/5 border-transparent'
                        )}
                    >
                        <a href={`#${item.id}`} onClick={handleClick}>
                            <TocLinkContent title={item.title} isActive={isHighlighted} />
                        </a>
                    </SidebarMenuSubButton>
                    {hasChildren && (
                        <ExpandButton isOpen={isExpanded} onToggle={handleToggle} />
                    )}
                </div>

                {hasChildren && (
                    <CollapsibleChildren isOpen={isExpanded}>
                        <ul className='ml-4 border-l border-accent/30 pl-2 mt-1'>
                            {item.children.map(child => (
                                <TocNode
                                    key={child.id || child.title}
                                    item={child}
                                    depth={depth + 1}
                                    activeId={activeId}
                                    expandedIds={expandedIds}
                                    onToggle={onToggle}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </ul>
                    </CollapsibleChildren>
                )}
            </SidebarMenuSubItem>
        )
    }

    // Third-level items (depth 2+)
    return (
        <li className={cn(
            'my-0.5 py-1 px-1 rounded transition-all duration-200',
            isActive && 'bg-accent/5'
        )}>
            <a
                href={`#${item.id}`}
                className={cn(
                    'text-sm transition-colors duration-200 hover:text-accent',
                    isActive && 'text-accent'
                )}
                onClick={() => onNavigate(item.id)}
            >
                <TocLinkContent title={item.title} isActive={isActive} />
            </a>
        </li>
    )
}
