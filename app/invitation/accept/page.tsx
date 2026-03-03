import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { OrganizationError, acceptOrganizationInvitation } from "@/lib/organizations"

const redirectToLogin = (token: string): never => {
  const callbackUrl = `/invitation/accept?token=${encodeURIComponent(token)}`
  redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
}

const InvitationAcceptPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) => {
  const { token: rawToken } = await searchParams
  const token = rawToken?.trim()

  if (!token) {
    redirect("/overview?invitation=invalid")
  }

  const session = await auth()
  const userId = session?.user?.id ?? ""

  if (!userId) {
    redirectToLogin(token)
  }

  try {
    await acceptOrganizationInvitation({
      token,
      userId,
    })

    redirect("/overview?invitation=accepted")
  } catch (error) {
    if (error instanceof OrganizationError) {
      switch (error.code) {
        case "email_mismatch":
          redirect("/overview?invitation=email-mismatch")
        case "invitation_expired":
          redirect("/overview?invitation=expired")
        case "invitation_revoked":
          redirect("/overview?invitation=revoked")
        default:
          redirect("/overview?invitation=invalid")
      }
    }

    redirect("/overview?invitation=invalid")
  }
}

export default InvitationAcceptPage
