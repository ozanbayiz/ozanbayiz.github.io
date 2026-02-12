import 'katex/dist/katex.min.css'

export default function ProjectsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
      <section className='container mx-auto space-y-8 px-4'>
          {children}
      </section>
  )
}

