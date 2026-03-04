import * as React from 'react'

import { cn } from '@/lib/utils'

const ShellBody = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="flex flex-1 overflow-x-hidden overflow-y-auto overscroll-none p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0"
      {...props}
    >
      <div className={cn('flex w-full flex-1 flex-col gap-6', className)}>{children}</div>
    </div>
  )
}

export { ShellBody }
