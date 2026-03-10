'use client'

import Link from 'next/link'
import * as React from 'react'

import { ProjectArticleContext } from './ProjectArticleShell'

export default function ProjectFooter() {
    const { prev, next } = React.useContext(ProjectArticleContext)

    return (
        <footer className='py-16 md:py-20 px-6 md:px-8 mx-auto w-full max-w-screen-md'>
            {(prev || next) ? (
                <div className='flex items-center justify-between border-t pt-8 mb-16'>
                    {prev ? (
                        <Link href={`/projects/${prev.slug}/`} className='gradient-link text-sm'>
                            &larr; {prev.title}
                        </Link>
                    ) : <span />}
                    {next ? (
                        <Link href={`/projects/${next.slug}/`} className='gradient-link text-sm'>
                            {next.title} &rarr;
                        </Link>
                    ) : <span />}
                </div>
            ) : (
                <div className='h-px w-full bg-foreground mb-16' />
            )}
            <p className='text-xs text-foreground text-center'>
                ozanbayiz {new Date().getFullYear()}
                <span className='animate-blink ml-1'>_</span>
            </p>
        </footer>
    )
}
