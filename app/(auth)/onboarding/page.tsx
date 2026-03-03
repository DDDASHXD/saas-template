import type { Metadata } from "next"

import { OnboardingForm } from "@/components/auth/onboarding-form"

export const metadata: Metadata = {
  title: "Complete Your Profile",
}

const OnboardingPage = () => {
  return <OnboardingForm />
}

export default OnboardingPage
