import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const quickStartSteps = [
  'Create your first workspace and invite teammates.',
  'Connect your billing provider and verify webhook events.',
  'Configure custom domain and email sender identity.',
  'Enable production monitoring and alert destinations.',
]

const endpoints = [
  { method: 'GET', route: '/api/projects', purpose: 'List all visible projects' },
  { method: 'POST', route: '/api/projects', purpose: 'Create a new project' },
  { method: 'GET', route: '/api/billing/invoices', purpose: 'List recent invoices' },
  { method: 'POST', route: '/api/auth/request-email-otp', purpose: 'Issue login OTP' },
]

const DocumentationPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Documentation</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Product docs, quick start notes, and API reference snippets
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody className="gap-8">
        <section>
          <h2 className="text-sm font-semibold">Quick start</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            {quickStartSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-sm font-semibold">API endpoints</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/70 bg-[var(--shell-panel)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Method</th>
                  <th className="px-3 py-2 font-medium">Route</th>
                  <th className="px-3 py-2 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((endpoint) => (
                  <tr key={`${endpoint.method}-${endpoint.route}`} className="border-t border-border/70">
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{endpoint.route}</td>
                    <td className="px-3 py-2 text-muted-foreground">{endpoint.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border/70 bg-[var(--shell-panel)] p-5">
          <h2 className="text-sm font-semibold">Server component pattern</h2>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-border/70 bg-background/70 p-3 text-xs text-muted-foreground">
            <code>{`export default async function Page() {
  const data = await fetchData()
  return <DashboardSection data={data} />
}`}</code>
          </pre>
        </section>
      </ShellBody>
    </>
  )
}

export default DocumentationPage
