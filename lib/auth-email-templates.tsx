import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import type { CSSProperties, ReactNode } from "react"

import { siteConfig } from "@/config"

interface AuthEmailShellProps {
  previewText: string
  children: ReactNode
}

interface AuthActionEmailProps {
  previewText: string
  title: string
  message: string
  buttonLabel: string
  buttonUrl: string
  expiryText: string
  safetyText?: string
}

const colors = {
  background: "#f4f4f5",
  cardBackground: "#ffffff",
  border: "#e4e4e7",
  heading: "#09090b",
  body: "#27272a",
  muted: "#71717a",
  button: "#18181b",
  buttonText: "#fafafa",
} as const

const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", sans-serif'

const baseUrl = siteConfig.url.replace(/\/$/, "")
const configuredLogo = siteConfig.logo.full?.trim()
const logoUrl = configuredLogo
  ? /^(https?:)?\/\//.test(configuredLogo)
    ? configuredLogo
    : `${baseUrl}${configuredLogo.startsWith("/") ? "" : "/"}${configuredLogo}`
  : null

const shellStyles = {
  body: {
    backgroundColor: colors.background,
    margin: "0",
    padding: "32px 16px",
    fontFamily,
  } satisfies CSSProperties,
  container: {
    maxWidth: "560px",
    margin: "0 auto",
  } satisfies CSSProperties,
  card: {
    backgroundColor: colors.cardBackground,
    border: `1px solid ${colors.border}`,
    borderRadius: "14px",
    padding: "28px",
  } satisfies CSSProperties,
  logoWrap: {
    margin: "0 0 12px",
  } satisfies CSSProperties,
  logo: {
    display: "block",
    maxWidth: "172px",
    height: "auto",
  } satisfies CSSProperties,
  brand: {
    margin: "0 0 18px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.muted,
  } satisfies CSSProperties,
  footer: {
    margin: "16px 4px 0",
    fontSize: "12px",
    lineHeight: "18px",
    color: colors.muted,
    textAlign: "center",
  } satisfies CSSProperties,
} as const

const contentStyles = {
  heading: {
    margin: "0 0 14px",
    color: colors.heading,
    fontSize: "26px",
    lineHeight: "34px",
    fontWeight: "600",
    letterSpacing: "-0.02em",
  } satisfies CSSProperties,
  text: {
    margin: "0 0 14px",
    color: colors.body,
    fontSize: "15px",
    lineHeight: "24px",
  } satisfies CSSProperties,
  muted: {
    margin: "0",
    color: colors.muted,
    fontSize: "13px",
    lineHeight: "20px",
  } satisfies CSSProperties,
  button: {
    backgroundColor: colors.button,
    borderRadius: "10px",
    color: colors.buttonText,
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    padding: "12px 20px",
  } satisfies CSSProperties,
  buttonWrap: {
    margin: "22px 0 16px",
  } satisfies CSSProperties,
  divider: {
    margin: "22px 0 16px",
    borderColor: colors.border,
  } satisfies CSSProperties,
  codeWrap: {
    margin: "20px 0 16px",
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    backgroundColor: colors.background,
    padding: "16px",
    textAlign: "center",
  } satisfies CSSProperties,
  code: {
    margin: "0",
    color: colors.heading,
    fontSize: "32px",
    lineHeight: "40px",
    letterSpacing: "0.34em",
    fontWeight: "700",
    fontFamily: '"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    paddingLeft: "0.34em",
  } satisfies CSSProperties,
  inlineLink: {
    color: colors.heading,
  } satisfies CSSProperties,
} as const

const AuthEmailShell = ({ previewText, children }: AuthEmailShellProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Body style={shellStyles.body}>
      <Container style={shellStyles.container}>
        <Section style={shellStyles.card}>
          {logoUrl ? (
            <Section style={shellStyles.logoWrap}>
              <Img src={logoUrl} alt={`${siteConfig.name} logo`} width={172} style={shellStyles.logo} />
            </Section>
          ) : null}
          <Text style={shellStyles.brand}>{siteConfig.name}</Text>
          {children}
        </Section>
        <Text style={shellStyles.footer}>
          {siteConfig.name}
          {" · "}
          If you did not expect this message, you can safely ignore it.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const AuthActionEmail = ({
  previewText,
  title,
  message,
  buttonLabel,
  buttonUrl,
  expiryText,
  safetyText,
}: AuthActionEmailProps) => (
  <AuthEmailShell previewText={previewText}>
    <Heading style={contentStyles.heading}>{title}</Heading>
    <Text style={contentStyles.text}>{message}</Text>
    <Section style={contentStyles.buttonWrap}>
      <Button href={buttonUrl} style={contentStyles.button}>
        {buttonLabel}
      </Button>
    </Section>
    <Hr style={contentStyles.divider} />
    <Text style={contentStyles.muted}>{expiryText}</Text>
    {safetyText ? <Text style={{ ...contentStyles.muted, marginTop: "8px" }}>{safetyText}</Text> : null}
    <Text style={{ ...contentStyles.muted, marginTop: "12px" }}>
      If the button does not work, paste this URL into your browser:
      <br />
      <a href={buttonUrl} style={contentStyles.inlineLink}>
        {buttonUrl}
      </a>
    </Text>
  </AuthEmailShell>
)

interface OtpEmailProps {
  otp: string
}

export const OtpEmail = ({ otp }: OtpEmailProps) => (
  <AuthEmailShell previewText={`Your ${siteConfig.name} sign-in code`}>
    <Heading style={contentStyles.heading}>Your sign-in code</Heading>
    <Text style={contentStyles.text}>
      Enter this one-time code in the sign-in screen to continue.
    </Text>
    <Section style={contentStyles.codeWrap}>
      <Text style={contentStyles.code}>{otp}</Text>
    </Section>
    <Hr style={contentStyles.divider} />
    <Text style={contentStyles.muted}>This code expires in 10 minutes.</Text>
    <Text style={{ ...contentStyles.muted, marginTop: "8px" }}>
      Never share this code with anyone.
    </Text>
  </AuthEmailShell>
)
