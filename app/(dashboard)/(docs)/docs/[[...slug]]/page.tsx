import Link from "next/link"
import { notFound } from "next/navigation"

import { MdxArticle } from "@/components/docs/mdx-article"
import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from "@/components/shell"
import { getMdxDocument } from "@/lib/mdx-docs"

const DocsPage = async ({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) => {
  const { slug = [] } = await params
  const document = await getMdxDocument("/docs", slug)

  if (!document) {
    notFound()
  }

  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>{document.title}</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>
          {document.description || "Documentation"}
        </ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_16rem]">
          <MdxArticle source={document.source} />

          <aside className="hidden xl:block">
            <div className="sticky top-6">
              <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                On This Page
              </p>
              {document.toc.length > 0 ? (
                <nav className="space-y-1">
                  {document.toc.map((item) => (
                    <Link
                      key={item.id}
                      href={`#${item.id}`}
                      className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      style={{ paddingLeft: `${0.5 + (item.level - 2) * 0.75}rem` }}
                    >
                      {item.text}
                    </Link>
                  ))}
                </nav>
              ) : (
                <p className="text-sm text-muted-foreground">No headings in this document.</p>
              )}
            </div>
          </aside>
        </div>
      </ShellBody>
    </>
  )
}

export default DocsPage
