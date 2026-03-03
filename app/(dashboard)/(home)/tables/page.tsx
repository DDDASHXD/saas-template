import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const subscriptions = [
  { customer: 'Acme Inc', plan: 'Enterprise', seats: 42, mrr: '$4,200', status: 'Active' },
  { customer: 'Northwind', plan: 'Pro', seats: 18, mrr: '$1,260', status: 'Active' },
  { customer: 'Bluebird Labs', plan: 'Pro', seats: 12, mrr: '$840', status: 'Past due' },
  { customer: 'Sunset Studio', plan: 'Starter', seats: 4, mrr: '$99', status: 'Trial' },
]

const invoices = [
  { id: 'INV-3102', customer: 'Acme Inc', amount: '$4,200', due: 'Mar 12', state: 'Paid' },
  { id: 'INV-3101', customer: 'Northwind', amount: '$1,260', due: 'Mar 10', state: 'Open' },
  { id: 'INV-3100', customer: 'Bluebird Labs', amount: '$840', due: 'Mar 8', state: 'Overdue' },
  { id: 'INV-3099', customer: 'Sunset Studio', amount: '$99', due: 'Mar 6', state: 'Paid' },
]

const stateClass: Record<string, string> = {
  Active: 'bg-primary/10 text-primary',
  'Past due': 'bg-destructive/10 text-destructive',
  Trial: 'bg-muted text-muted-foreground',
  Paid: 'bg-primary/10 text-primary',
  Open: 'bg-muted text-muted-foreground',
  Overdue: 'bg-destructive/10 text-destructive',
}

const TablesPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Tables</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Example tabular views for billing and subscription data
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody className="gap-8">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Active subscriptions</h2>
          <div className="overflow-x-auto rounded-xl border border-border/70 bg-[var(--shell-panel)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Customer</th>
                  <th className="px-3 py-2 font-medium">Plan</th>
                  <th className="px-3 py-2 font-medium">Seats</th>
                  <th className="px-3 py-2 font-medium">MRR</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((row) => (
                  <tr key={row.customer} className="border-t border-border/70">
                    <td className="px-4 py-2.5 font-medium">{row.customer}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.plan}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.seats}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.mrr}</td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${stateClass[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Recent invoices</h2>
          <div className="overflow-x-auto rounded-xl border border-border/70 bg-[var(--shell-panel)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Invoice</th>
                  <th className="px-3 py-2 font-medium">Customer</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Due date</th>
                  <th className="px-3 py-2 font-medium">State</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((row) => (
                  <tr key={row.id} className="border-t border-border/70">
                    <td className="px-4 py-2.5 font-medium">{row.id}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.customer}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.amount}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.due}</td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${stateClass[row.state]}`}>
                        {row.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ShellBody>
    </>
  )
}

export default TablesPage
