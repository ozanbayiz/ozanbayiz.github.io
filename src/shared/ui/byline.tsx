/* One byline, two surfaces: the research card and the report-page
 * letterhead render the same author list, so the comma join, the
 * owner's self-underline, and the equal-contribution marks live here
 * and the two can never drift. */

export type BylineAuthor = { name: string; self?: boolean; mark?: string }

export default function Byline({
    authors,
    offset,
    marks = false
}: {
    authors: BylineAuthor[]
    /** underline-offset-* utility matched to the surface's type size */
    offset: string
    /** render each author's mark — only where the note explaining the
     * marks lives (the report page), never on the card */
    marks?: boolean
}) {
    return (
        <>
            {authors.map((author, i) => (
                <span key={author.name}>
                    {i > 0 && ', '}
                    {/* The site owner's name is underlined — the
                     * academic self-highlight. The mark stays outside
                     * the underline. */}
                    {author.self ? (
                        <span className={`underline decoration-1 ${offset}`}>
                            {author.name}
                        </span>
                    ) : (
                        author.name
                    )}
                    {marks && author.mark}
                </span>
            ))}
        </>
    )
}
