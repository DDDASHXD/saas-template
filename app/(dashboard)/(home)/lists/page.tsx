import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const teamMembers = [
  { name: 'Maya Patel', role: 'Product Designer', status: 'Online', projects: 4 },
  { name: 'Liam Brooks', role: 'Frontend Engineer', status: 'In focus mode', projects: 6 },
  { name: 'Sara Nguyen', role: 'Customer Success', status: 'In meeting', projects: 3 },
  { name: 'Jonas Eriksen', role: 'Growth Lead', status: 'Online', projects: 5 },
]

const backlog = [
  'Design account switcher states for mobile',
  'Finalize onboarding checklist copy',
  'Add tenant-level API rate limit alerts',
  'Prepare April release notes',
]

const activityFeed = [
  'New teammate joined "Website Revamp" project',
  'Incident #142 resolved and postmortem added',
  'Stripe webhook timeout dropped below 200ms',
  'Quarterly OKR review scheduled for Friday',
]

const ListsPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Lists</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Example list views for teams, tasks, and activity
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody className="gap-8">
        <section className="rounded-xl border border-border/70 bg-[var(--shell-panel)] p-5">
          <h2 className="text-sm font-semibold">Team members</h2>
          <ul className="mt-4 space-y-2">
            {teamMembers.map((member) => (
              <li
                key={member.name}
                className="rounded-lg border border-border/70 bg-background/70 p-3.5 md:grid md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-4"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <p className="text-sm text-muted-foreground">{member.status}</p>
                <p className="text-sm text-muted-foreground">{member.projects} projects</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article>
            <h2 className="text-sm font-semibold">Current backlog</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {backlog.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ol>
          </article>

          <article>
            <h2 className="text-sm font-semibold">Activity feed</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {activityFeed.map((activity) => (
                <li key={activity} className="rounded-md border border-border/70 bg-[var(--shell-panel)] px-3 py-2.5">
                  {activity}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </ShellBody>
    </>
  )
}

export default ListsPage
