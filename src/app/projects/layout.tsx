export default function ProjectsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
      <section className='container mx-auto space-y-6 px-4'>
          {children}
      </section>
  )
}

