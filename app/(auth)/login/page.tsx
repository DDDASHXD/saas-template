import type { Metadata } from "next"

import { getEnabledProviders } from "@/lib/auth-providers"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In",
}

const LoginPage = () => {
  const enabledProviders = getEnabledProviders()

  return <LoginForm enabledProviders={enabledProviders} />
}

export default LoginPage
