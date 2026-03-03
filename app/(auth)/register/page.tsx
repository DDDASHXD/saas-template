import type { Metadata } from "next"

import { getEnabledProviders } from "@/lib/auth-providers"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account",
}

const RegisterPage = () => {
  const enabledProviders = getEnabledProviders()

  return <RegisterForm enabledProviders={enabledProviders} />
}

export default RegisterPage
