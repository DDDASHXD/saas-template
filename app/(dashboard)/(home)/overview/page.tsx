import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const metrics = [
  { label: 'Monthly Recurring Revenue', value: '$48,320', change: '+12.4%' },
  { label: 'Active Customers', value: '1,284', change: '+8.1%' },
  { label: 'Churn Rate', value: '2.1%', change: '-0.4%' },
  { label: 'Open Support Tickets', value: '17', change: '-6 today' },
]

const recentActivity = [
  {
    title: 'Acme Inc upgraded to Pro',
    description: 'Plan changed from Starter to Pro (annual billing)',
    time: '12 minutes ago',
  },
  {
    title: 'New teammate invited',
    description: 'Maya Patel was invited to Workspace A',
    time: '45 minutes ago',
  },
  {
    title: 'Webhook delivery retries increased',
    description: 'Investigate latency in the `billing.updated` pipeline',
    time: '2 hours ago',
  },
  {
    title: 'Weekly digest sent',
    description: 'Digest delivered to 1,102 recipients',
    time: '4 hours ago',
  },
]

const roadmap = [
  { item: 'Public API v2', progress: 80 },
  { item: 'Billing portal refresh', progress: 55 },
  { item: 'Role-based access controls', progress: 40 },
]

const OverviewPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Overview</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>Welcome to your dashboard</ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody className="gap-8">
        <section className="grid gap-6 border-b pb-6 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.label}>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.change} vs last month</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="rounded-xl border border-border/70 bg-[var(--shell-panel)] p-5 xl:col-span-2">
            <h2 className="text-sm font-semibold">Recent activity</h2>
            <ul className="mt-4 space-y-2">
              {recentActivity.map((entry) => (
                <li key={entry.title} className="rounded-lg border border-border/70 bg-background/70 p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{entry.title}</p>
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">{entry.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article>
            <h2 className="text-sm font-semibold">Roadmap progress</h2>
            <ul className="mt-4 space-y-5">
              {roadmap.map((feature) => (
                <li key={feature.item}>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm">{feature.item}</p>
                    <p className="text-xs text-muted-foreground">{feature.progress}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${feature.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </ShellBody>
    </>
  )
}

export default OverviewPage
