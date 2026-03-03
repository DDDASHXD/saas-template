import type { Metadata } from "next"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
}

const ResetPasswordPage = () => {
  return <ResetPasswordForm />
}

export default ResetPasswordPage
