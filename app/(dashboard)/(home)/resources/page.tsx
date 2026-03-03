import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const resourceGroups = [
  {
    name: 'Product templates',
    items: ['PRD template', 'Sprint planning board', 'Weekly scorecard'],
  },
  {
    name: 'Engineering resources',
    items: ['Incident checklist', 'API versioning policy', 'Postmortem template'],
  },
  {
    name: 'Growth toolkit',
    items: ['Onboarding email pack', 'Referral campaign brief', 'Pricing experiment log'],
  },
]

const ResourcesPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Resources</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Access templates, downloads, and additional resources
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody className="gap-8">
        <section className="grid gap-6 md:grid-cols-3">
          {resourceGroups.map((group) => (
            <article
              key={group.name}
              className="rounded-xl border border-border/70 bg-[var(--shell-panel)] p-5"
            >
              <h2 className="text-sm font-semibold">{group.name}</h2>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </ShellBody>
    </>
  )
}

export default ResourcesPage
