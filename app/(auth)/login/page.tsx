import type { Metadata } from "next"
import { Suspense } from "react"

import { siteConfig } from "@/config"
import { LoginForm } from "@/components/auth/login-form"
import { getEnabledProviders } from "@/lib/auth-providers"

export const metadata: Metadata = {
  title: "Sign In",
}

const LoginPage = () => {
  const enabledProviders = getEnabledProviders()

  return (
    <Suspense>
      <LoginForm
        enabledProviders={enabledProviders}
        genericLoginType={siteConfig.auth.genericLoginType}
        requireEmailConfirmation={siteConfig.auth.requireEmailConfirmation}
        disableRegistration={siteConfig.auth.disableRegistration}
      />
    </Suspense>
  )
}

export default LoginPage
