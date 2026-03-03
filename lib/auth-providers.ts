export const getEnabledProviders = () => {
  const providers: string[] = []
  if (process.env.GOOGLE_CLIENT_ID) providers.push("google")
  if (process.env.DISCORD_CLIENT_ID) providers.push("discord")
  if (process.env.GITHUB_CLIENT_ID) providers.push("github")
  if (process.env.TWITTER_CLIENT_ID) providers.push("twitter")
  return providers
}
