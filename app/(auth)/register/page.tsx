import type { Metadata } from "next"

import { siteConfig } from "@/config"
import { RegisterForm } from "@/components/auth/register-form"
import { getEnabledProviders } from "@/lib/auth-providers"

export const metadata: Metadata = {
  title: "Create Account",
}

const RegisterPage = () => {
  const enabledProviders = getEnabledProviders()

  return (
    <RegisterForm
      enabledProviders={enabledProviders}
      genericLoginType={siteConfig.auth.genericLoginType}
      requireEmailConfirmation={siteConfig.auth.requireEmailConfirmation}
    />
  )
}

export default RegisterPage
