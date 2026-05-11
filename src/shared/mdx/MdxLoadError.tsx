export default function MdxLoadError({ slug }: { slug: string }) {
    return (
        <p className='text-sm text-foreground'>
            Failed to load <code>{slug}</code>. Please refresh the page.
        </p>
    )
}
