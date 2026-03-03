import type { Metadata } from "next"

import { siteConfig } from "@/config"
import { LoginForm } from "@/components/auth/login-form"
import { getEnabledProviders } from "@/lib/auth-providers"

export const metadata: Metadata = {
  title: "Sign In",
}

const LoginPage = () => {
  const enabledProviders = getEnabledProviders()

  return (
    <LoginForm
      enabledProviders={enabledProviders}
      genericLoginType={siteConfig.auth.genericLoginType}
      requireEmailConfirmation={siteConfig.auth.requireEmailConfirmation}
    />
  )
}

export default LoginPage
