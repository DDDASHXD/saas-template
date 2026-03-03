import * as React from 'react'

import { cn } from '@/lib/utils'

const ShellBody = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex flex-1 flex-col gap-4 p-4 md:p-6 pt-0!', className)} {...props}>
      <div className="">{children}</div>
    </div>
  )
}

export { ShellBody }
