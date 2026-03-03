import * as React from "react"

import { cn } from "@/lib/utils"

const ShellContentHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex flex-col gap-1 p-6", className)} {...props}>
      {children}
    </div>
  )
}

const ShellContentHeaderTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1
      className={cn("text-2xl font-bold tracking-tight", className)}
      {...props}
    >
      {children}
    </h1>
  )
}

const ShellContentHeaderDescription = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p className={cn("text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

export {
  ShellContentHeader,
  ShellContentHeaderTitle,
  ShellContentHeaderDescription,
}
