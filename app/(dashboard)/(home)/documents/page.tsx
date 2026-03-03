import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'

const docs = [
  {
    name: 'Q1 Growth Plan.pdf',
    type: 'Product Strategy',
    owner: 'Jordan Kim',
    updated: '2 hours ago',
    size: '2.4 MB',
  },
  {
    name: 'Customer Interview Notes.md',
    type: 'Research',
    owner: 'Avery Chen',
    updated: 'Yesterday',
    size: '180 KB',
  },
  {
    name: 'Billing Runbook.docx',
    type: 'Operations',
    owner: 'Nina Lopez',
    updated: '2 days ago',
    size: '860 KB',
  },
  {
    name: 'Launch Checklist.xlsx',
    type: 'Release',
    owner: 'Team Ops',
    updated: '4 days ago',
    size: '410 KB',
  },
]

const DocumentsPage = () => {
  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>Documents</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          Manage your documents and files
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody className="gap-8">
        <section className="grid gap-6 border-b pb-6 md:grid-cols-3">
          <article>
            <p className="text-xs text-muted-foreground">Total files</p>
            <p className="mt-2 text-2xl font-semibold">248</p>
          </article>
          <article>
            <p className="text-xs text-muted-foreground">Shared with team</p>
            <p className="mt-2 text-2xl font-semibold">91</p>
          </article>
          <article>
            <p className="text-xs text-muted-foreground">Storage used</p>
            <p className="mt-2 text-2xl font-semibold">18.7 GB</p>
          </article>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold">Recent documents</h2>
          <div className="overflow-x-auto rounded-xl border border-border/70 bg-[var(--shell-panel)]">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Document</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc.name} className="border-t border-border/70">
                    <td className="px-4 py-3.5">
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{doc.owner}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{doc.updated}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{doc.size}</td>
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

export default DocumentsPage
