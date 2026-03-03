import * as React from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"
import { createSlugger } from "@/lib/mdx-docs"

const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join("")
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children)
  }

  return ""
}

const MdxArticle = async ({
  source,
  className,
}: {
  source: string
  className?: string
}) => {
  const slugify = createSlugger()

  return (
    <article
      className={cn(
        "max-w-none text-sm leading-7 text-foreground",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
        "[&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight",
        "[&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:border-border/70 [&_h2]:pb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mb-2 [&_h3]:mt-7 [&_h3]:scroll-mt-24 [&_h3]:text-base [&_h3]:font-semibold",
        "[&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_p]:my-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border/70 [&_pre]:bg-[var(--shell-panel)] [&_pre]:p-4",
        "[&_table]:my-5 [&_table]:w-full [&_table]:text-sm [&_td]:border-t [&_td]:border-border/70 [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-muted-foreground",
        className
      )}
    >
      <MDXRemote
        source={source}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        components={{
          h2: ({ children, ...props }) => {
            const id = slugify(getNodeText(children))
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            )
          },
          h3: ({ children, ...props }) => {
            const id = slugify(getNodeText(children))
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            )
          },
        }}
      />
    </article>
  )
}

export { MdxArticle }
