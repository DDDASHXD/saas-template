import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const guides = [
  {
    title: 'Getting started with workspaces',
    description: 'Set up your first workspace, invite teammates, and configure roles.',
    duration: '8 min read',
    level: 'Beginner',
  },
  {
    title: 'Shipping feature flags safely',
    description: 'Roll out high-risk features with canaries and metrics gating.',
    duration: '11 min read',
    level: 'Intermediate',
  },
  {
    title: 'Billing operations handbook',
    description: 'Handle failed payments, retries, and account recovery flows.',
    duration: '14 min read',
    level: 'Advanced',
  },
]

const GuidesPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Guides</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Browse tutorials and getting started guides
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody className="gap-8">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Featured</h2>
          {guides.map((guide) => (
            <article
              key={guide.title}
              className="rounded-xl border border-border/70 bg-[var(--shell-panel)] p-5"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-base font-semibold">{guide.title}</h3>
                <p className="text-xs text-muted-foreground">{guide.duration}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{guide.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">{guide.level}</p>
            </article>
          ))}
        </section>
      </ShellBody>
    </>
  )
}

export default GuidesPage
