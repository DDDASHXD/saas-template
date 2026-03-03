import Link from "next/link"

import { siteConfig } from "@/config"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 px-6 py-12">
        <Link href="/">
          <img
            src={siteConfig.logo.icon}
            alt={siteConfig.name}
            className="h-10 dark:invert"
          />
        </Link>
        {children}
      </div>
    </section>
  )
}

export default AuthLayout
