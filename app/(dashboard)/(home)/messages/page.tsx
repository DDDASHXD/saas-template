'use client'

import React from 'react'
import {
  ShellBody,
  ShellContentHeader,
  ShellContentHeaderDescription,
  ShellContentHeaderTitle,
} from '@/components/shell'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HugeiconsIcon } from '@hugeicons/react'
import { Paperclip, ArrowUp, SparklesIcon } from '@hugeicons/core-free-icons'
import { useUser } from '@/hooks/use-user'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const exampleMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Can you explain how React Server Components work?',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'React Server Components (RSC) allow you to render components on the server without sending their JavaScript to the client. This means you can access backend resources directly, reduce bundle size, and improve performance.\n\nKey points:\n- Server Components run only on the server and have zero client-side JavaScript\n- They can directly access databases, file systems, and other server-only resources\n- Client Components still handle interactivity and are hydrated in the browser\n- You can nest Client Components inside Server Components and vice versa',
  },
  {
    id: '3',
    role: 'user',
    content: 'How do I decide when to use a Client Component vs a Server Component?',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      "Great question! Here's a simple rule of thumb:\n\nUse **Server Components** when you:\n- Need to fetch data or access backend resources\n- Don't need interactivity (no onClick, onChange, useState, etc.)\n- Want to keep the component's code out of the client bundle\n\nUse **Client Components** when you:\n- Need interactivity (event handlers, state, effects)\n- Use browser-only APIs (localStorage, window, etc.)\n- Need to use React hooks like useState or useEffect\n\nIn Next.js App Router, components are Server Components by default. Add `'use client'` at the top of a file to make it a Client Component.",
  },
]

const MessageBubble = ({
  message,
  userImage,
  userInitials,
  userName,
}: {
  message: Message
  userImage: string
  userInitials: string
  userName: string
}) => {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex w-full max-w-full gap-3 sm:max-w-2xl', isUser && 'ml-auto flex-row-reverse')}>
      {isUser ? (
        <Avatar className="size-7 shrink-0 mt-0.5">
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground mt-0.5">
          <HugeiconsIcon icon={SparklesIcon} size={14} />
        </div>
      )}
      <div
        className={cn(
          'rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

const MessagesPage = () => {
  const [content, setContent] = React.useState('')
  const { name, image, initials } = useUser()

  return (
    <>
      <ShellContentHeader>
        <ShellContentHeaderTitle>AI Chat</ShellContentHeaderTitle>
        <ShellContentHeaderDescription>Chat with your AI assistant</ShellContentHeaderDescription>
      </ShellContentHeader>
      <ShellBody>
        <div className="flex h-full w-full min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 py-4">
              {exampleMessages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  userImage={image}
                  userInitials={initials}
                  userName={name}
                />
              ))}
            </div>
          </div>
          <div className="mx-auto h-max w-full max-w-2xl rounded-xl border p-2">
            <div className="h-20 p-2">
              <textarea
                className="h-full w-full resize-none bg-transparent text-sm focus:outline-none"
                placeholder="Ask anything..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex w-full justify-between">
              <Button variant="ghost" size="icon">
                <HugeiconsIcon icon={Paperclip} />
              </Button>
              <Button variant="default" size="icon" disabled={!content}>
                <HugeiconsIcon icon={ArrowUp} />
              </Button>
            </div>
          </div>
        </div>
      </ShellBody>
    </>
  )
}

export default MessagesPage
